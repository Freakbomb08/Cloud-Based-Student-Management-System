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

app.use(
  cors({
    origin: [frontendUrl],
    credentials: false,
  })
);
app.use(express.json());

function getBearerToken(authHeader = "") {
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }
  return authHeader.slice("Bearer ".length).trim();
}

function normalizeRole(role) {
  if (role === "student" || role === "faculty" || role === "admin") {
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
      INSERT INTO users (firebase_uid, email, display_name, photo_url, role, last_login_at, updated_at)
      VALUES ($1, $2, $3, $4, COALESCE($5, 'student'), NOW(), NOW())
      ON CONFLICT (firebase_uid)
      DO UPDATE SET
        email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, users.display_name),
        photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url),
        role = COALESCE(EXCLUDED.role, users.role),
        last_login_at = NOW(),
        updated_at = NOW()
      RETURNING firebase_uid, email, display_name, photo_url, role, created_at, updated_at, last_login_at
      `,
      [firebaseUid, email, displayName, photoUrl, claimedRole]
    );

    const user = rows[0];

    return res.json({
      user: {
        id: user.firebase_uid,
        email: user.email,
        name: user.display_name || user.email,
        photoUrl: user.photo_url,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLoginAt: user.last_login_at,
      },
    });
  } catch (error) {
    console.error("Failed to sync auth session:", error);
    return res.status(500).json({ message: "Failed to sync user session." });
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
