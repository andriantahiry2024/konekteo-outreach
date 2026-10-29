// Applies db/schema.sql at container start. Idempotent.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, "..", "db", "schema.sql"), "utf8");

if (!process.env.DATABASE_URL) {
  console.error("[migrate] DATABASE_URL manquant");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  await client.query(sql);
  console.log("[migrate] schéma appliqué");
} catch (err) {
  console.error("[migrate] échec:", err?.message || err);
} finally {
  await client.end().catch(() => {});
}
