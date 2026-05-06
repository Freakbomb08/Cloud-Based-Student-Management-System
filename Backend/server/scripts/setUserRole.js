const dotenv = require("dotenv");

dotenv.config();

const { initializeFirebaseAdmin } = require("../src/firebaseAdmin");

const APP_ROLES = ["student", "faculty", "admin"];

function normalizeRole(role) {
  if (role === "teacher") return "faculty";
  return APP_ROLES.includes(role) ? role : null;
}

async function resolveUser(auth, identifier) {
  if (identifier.includes("@")) {
    return auth.getUserByEmail(identifier);
  }

  return auth.getUser(identifier);
}

async function main() {
  const [, , identifier, rawRole] = process.argv;
  const role = normalizeRole(rawRole);

  if (!identifier || !role) {
    console.error("Usage: npm run set-role -- <firebase-uid-or-email> <student|faculty|teacher|admin>");
    process.exit(1);
  }

  const admin = initializeFirebaseAdmin();
  const auth = admin.auth();
  const user = await resolveUser(auth, identifier);
  const currentClaims = user.customClaims || {};

  await auth.setCustomUserClaims(user.uid, {
    ...currentClaims,
    role,
  });

  console.log(`Set role=${role} for ${user.email || user.uid}. Ask the user to sign in again or refresh their ID token.`);
}

main().catch((error) => {
  console.error("Failed to set user role:", error);
  process.exit(1);
});
