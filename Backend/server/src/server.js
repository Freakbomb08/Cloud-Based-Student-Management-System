const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const { ensureSchema, pool } = require("./db");
const { initializeFirebaseAdmin } = require("./firebaseAdmin");

const app = express();
const port = Number(process.env.PORT || 3000);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

const firebaseAdmin = initializeFirebaseAdmin();
const APP_ROLES = ["student", "faculty", "admin"];
const MAX_PROFILE_PHOTO_LENGTH = 1_500_000;

app.use(
  cors({
    origin: [frontendUrl],
    credentials: false,
  })
);
app.use(express.json({ limit: "2mb" }));

function getBearerToken(authHeader = "") {
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }
  return authHeader.slice("Bearer ".length).trim();
}

function normalizeRole(role) {
  if (role === "teacher") {
    return "faculty";
  }

  if (APP_ROLES.includes(role)) {
    return role;
  }

  return null;
}

async function verifyFirebaseToken(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: "Missing bearer token." });
    }

    req.decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired Firebase token." });
  }
}

function requireRole(...allowedRoles) {
  const normalizedAllowedRoles = allowedRoles
    .map(normalizeRole)
    .filter(Boolean);

  return (req, res, next) => {
    const role = normalizeRole(req.decodedToken?.role);

    if (!role || !normalizedAllowedRoles.includes(role)) {
      return res.status(403).json({ message: "You do not have permission to access this resource." });
    }

    req.userRole = role;
    return next();
  };
}

function toSessionUser(user) {
  return {
    id: user.firebase_uid,
    email: user.email,
    name: user.display_name || user.email,
    photoUrl: user.photo_url,
    phoneNumber: user.phone_number,
    role: user.role,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastLoginAt: user.last_login_at,
  };
}

function normalizeOptionalString(value, maxLength) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function normalizePhotoUrl(value) {
  const photoUrl = normalizeOptionalString(value, MAX_PROFILE_PHOTO_LENGTH);

  if (!photoUrl) {
    return photoUrl;
  }

  if (
    photoUrl.startsWith("data:image/") ||
    photoUrl.startsWith("https://") ||
    photoUrl.startsWith("http://")
  ) {
    return photoUrl;
  }

  return undefined;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "Auth sync service",
    health: "/api/health",
  });
});

app.post("/api/auth/session", verifyFirebaseToken, async (req, res) => {
  try {
    const decoded = req.decodedToken;
    const firebaseUid = decoded.uid;
    const email = decoded.email || null;

    if (!firebaseUid || !email) {
      return res.status(400).json({ message: "Authenticated Firebase user must include uid and email." });
    }

    const displayName = decoded.name || null;
    const photoUrl = decoded.picture || null;
    const claimedRole = normalizeRole(decoded.role);

    const { rows } = await pool.query(
      `
      INSERT INTO users (firebase_uid, email, display_name, photo_url, phone_number, role, last_login_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'student'), NOW(), NOW())
      ON CONFLICT (firebase_uid)
      DO UPDATE SET
        email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, users.display_name),
        photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url),
        phone_number = COALESCE(EXCLUDED.phone_number, users.phone_number),
        role = COALESCE(EXCLUDED.role, users.role),
        last_login_at = NOW(),
        updated_at = NOW()
      RETURNING firebase_uid, email, display_name, photo_url, phone_number, role, created_at, updated_at, last_login_at
      `,
      [firebaseUid, email, displayName, photoUrl, decoded.phone_number || null, claimedRole]
    );

    const user = rows[0];

    return res.json({ user: toSessionUser(user) });
  } catch (error) {
    console.error("Failed to sync auth session:", error);
    return res.status(500).json({ message: "Failed to sync user session." });
  }
});

app.patch("/api/users/me", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.decodedToken.uid;
    const hasName = req.body?.name !== undefined;
    const hasPhoneNumber = req.body?.phoneNumber !== undefined;
    const hasPhotoUrl = req.body?.photoUrl !== undefined;
    const displayName = normalizeOptionalString(req.body?.name, 120);
    const phoneNumber = normalizeOptionalString(req.body?.phoneNumber, 30);
    const photoUrl = normalizePhotoUrl(req.body?.photoUrl);

    if (
      (req.body?.name !== undefined && displayName === undefined) ||
      (req.body?.phoneNumber !== undefined && phoneNumber === undefined) ||
      (req.body?.photoUrl !== undefined && photoUrl === undefined)
    ) {
      return res.status(400).json({ message: "Profile fields are invalid." });
    }

    const { rows } = await pool.query(
      `
      UPDATE users
      SET
        display_name = CASE WHEN $5 THEN COALESCE($2, display_name) ELSE display_name END,
        phone_number = CASE WHEN $6 THEN $3 ELSE phone_number END,
        photo_url = CASE WHEN $7 THEN $4 ELSE photo_url END,
        updated_at = NOW()
      WHERE firebase_uid = $1
      RETURNING firebase_uid, email, display_name, photo_url, phone_number, role, created_at, updated_at, last_login_at
      `,
      [firebaseUid, displayName, phoneNumber, photoUrl, hasName, hasPhoneNumber, hasPhotoUrl]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User profile has not been synced yet." });
    }

    return res.json({ user: toSessionUser(rows[0]) });
  } catch (error) {
    console.error("Failed to update current user:", error);
    return res.status(500).json({ message: "Failed to update profile." });
  }
});

app.get("/api/users/me", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.decodedToken.uid;

    const { rows } = await pool.query(
      `
      SELECT firebase_uid, email, display_name, photo_url, phone_number, role, created_at, updated_at, last_login_at
      FROM users
      WHERE firebase_uid = $1
      `,
      [firebaseUid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User profile has not been synced yet." });
    }

    return res.json({ user: toSessionUser(rows[0]) });
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return res.status(500).json({ message: "Failed to fetch current user." });
  }
});

app.post("/api/admin/users/:uid/role", verifyFirebaseToken, requireRole("admin"), async (req, res) => {
  try {
    const uid = String(req.params.uid || "").trim();
    const role = normalizeRole(req.body?.role);

    if (!uid) {
      return res.status(400).json({ message: "Firebase uid is required." });
    }

    if (!role) {
      return res.status(400).json({
        message: `Role must be one of: ${APP_ROLES.join(", ")}.`,
      });
    }

    const firebaseUser = await firebaseAdmin.auth().getUser(uid);

    if (!firebaseUser.email) {
      return res.status(400).json({ message: "Firebase user must have an email address before a role can be assigned." });
    }

    const currentClaims = firebaseUser.customClaims || {};

    await firebaseAdmin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      role,
    });

    await pool.query(
      `
      INSERT INTO users (firebase_uid, email, display_name, photo_url, role, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (firebase_uid)
      DO UPDATE SET
        email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, users.display_name),
        photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url),
        role = EXCLUDED.role,
        updated_at = NOW()
      `,
      [
        uid,
        firebaseUser.email,
        firebaseUser.displayName || null,
        firebaseUser.photoURL || null,
        role,
      ]
    );

    return res.json({
      user: {
        id: uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email,
        photoUrl: firebaseUser.photoURL || null,
        role,
      },
      message: "Role updated. The user must refresh their Firebase ID token or sign in again.",
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    return res.status(500).json({ message: "Failed to update user role." });
  }
});

async function start() {
  await ensureSchema();
  app.listen(port, () => {
    console.log(`Auth sync service listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
