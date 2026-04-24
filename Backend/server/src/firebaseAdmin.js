const admin = require("firebase-admin");

function loadServiceAccountFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw);
  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }

  return parsed;
}

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  const serviceAccount = loadServiceAccountFromEnv();

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return admin;
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  return admin;
}

module.exports = {
  initializeFirebaseAdmin,
};
