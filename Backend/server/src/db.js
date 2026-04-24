const { Pool } = require("pg");

function getConnectionString() {
  return process.env.PSQL_URI || process.env.DATABASE_URL || "";
}

const connectionString = getConnectionString();

if (!connectionString) {
  throw new Error("Missing PostgreSQL connection string. Set PSQL_URI or DATABASE_URL.");
}

const shouldUseSsl =
  process.env.PGSSLMODE === "require" || process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      firebase_uid TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT,
      photo_url TEXT,
      role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
      last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

module.exports = {
  pool,
  ensureSchema,
};
