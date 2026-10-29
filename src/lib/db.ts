import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __konekteoPool: Pool | undefined;
}

export const pool =
  global.__konekteoPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") global.__konekteoPool = pool;

export async function q<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await pool.query(text, params as never[]);
  return res.rows as T[];
}
