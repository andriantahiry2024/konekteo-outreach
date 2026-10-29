import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { q } from "./db";

const secret = process.env.SESSION_SECRET || "dev-secret-do-not-use-in-prod";
const SESSION_COOKIE = "k_session";
const ADMIN_COOKIE = "k_admin";
const SESSION_DAYS = 30;

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function newToken() {
  return randomBytes(24).toString("base64url");
}

function sign(value: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function createSessionValue(clientId: string) {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const payload = `${clientId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function readSessionValue(value: string | undefined) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [clientId, exp, sig] = parts;
  if (!safeEqual(sig, sign(`${clientId}.${exp}`))) return null;
  if (Number(exp) < Date.now()) return null;
  return clientId;
}

export function currentClientId() {
  return readSessionValue(cookies().get(SESSION_COOKIE)?.value);
}

export function setSessionCookie(clientId: string) {
  cookies().set(SESSION_COOKIE, createSessionValue(clientId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export function setAdminCookie() {
  cookies().set(ADMIN_COOKIE, sign("admin"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 3600,
  });
}

export function clearAdminCookie() {
  cookies().delete(ADMIN_COOKIE);
}

export function isAdmin() {
  const value = cookies().get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, sign("admin"));
}

export function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  return expected.length > 0 && input === expected;
}

/** Creates a 30-day magic link for a client. */
export async function createMagicLink(clientId: string, days = 30) {
  const token = newToken();
  const expires = new Date(Date.now() + days * 86_400_000);
  await q(
    `insert into magic_links (client_id, token_hash, expires_at) values ($1,$2,$3)`,
    [clientId, hashToken(token), expires]
  );
  return { token, expires };
}

/** Consumes a magic link token and returns the client id, or null. */
export async function resolveMagicLink(token: string) {
  const rows = await q<{ client_id: string }>(
    `select client_id from magic_links
     where token_hash = $1 and revoked = false and expires_at > now()
     limit 1`,
    [hashToken(token)]
  );
  return rows[0]?.client_id ?? null;
}
