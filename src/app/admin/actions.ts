"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { q } from "@/lib/db";
import {
  checkAdminPassword,
  clearAdminCookie,
  createMagicLink,
  setAdminCookie,
  isAdmin,
} from "@/lib/auth";

async function guard() {
  if (!isAdmin()) redirect("/admin/login");
}

export async function adminLogin(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!checkAdminPassword(password)) redirect("/admin/login?error=1");
  setAdminCookie();
  redirect("/admin");
}

export async function adminLogout() {
  clearAdminCookie();
  redirect("/admin/login");
}

export async function createClient(formData: FormData) {
  await guard();
  const company = String(formData.get("company") || "").trim();
  const contact = String(formData.get("contact") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const target = String(formData.get("target") || "").trim();

  if (!company || !contact || !email) redirect("/admin?error=missing");

  const rows = await q<{ id: string }>(
    `insert into clients (company, contact_name, email, target_label)
     values ($1,$2,$3,$4) returning id`,
    [company, contact, email, target]
  );

  revalidatePath("/admin");
  redirect(`/admin/client/${rows[0].id}`);
}

export async function generateLink(formData: FormData) {
  await guard();
  const clientId = String(formData.get("client_id") || "");
  if (!clientId) redirect("/admin");

  const { token } = await createMagicLink(clientId);
  redirect(`/admin/client/${clientId}?link=${token}`);
}

export async function addInbox(formData: FormData) {
  await guard();
  const clientId = String(formData.get("client_id") || "");
  const role = String(formData.get("role") || "Introduction");
  const email = String(formData.get("email") || "").trim();
  const senderName = String(formData.get("sender_name") || "").trim();
  const limit = Number(formData.get("daily_limit") || 35);

  if (!clientId || !email || !senderName) redirect(`/admin/client/${clientId}`);

  await q(
    `insert into sender_inboxes (client_id, role, email, sender_name, daily_limit)
     values ($1,$2,$3,$4,$5)`,
    [clientId, role, email, senderName, limit]
  );

  revalidatePath(`/admin/client/${clientId}`);
  redirect(`/admin/client/${clientId}`);
}

export async function logSends(formData: FormData) {
  await guard();
  const clientId = String(formData.get("client_id") || "");
  const inboxId = String(formData.get("inbox_id") || "") || null;
  const count = Math.max(0, Math.min(500, Number(formData.get("count") || 0)));
  const opened = Math.max(0, Math.min(count, Number(formData.get("opened") || 0)));

  if (!clientId || count === 0) redirect(`/admin/client/${clientId}?error=sends`);

  await q(
    `insert into sends (client_id, inbox_id, sent_at, opened_at)
     select $1::uuid, $2::uuid, now(),
            case when gs <= $3 then now() else null end
     from generate_series(1, $4::int) gs`,
    [clientId, inboxId, opened, count]
  );

  revalidatePath(`/admin/client/${clientId}`);
  redirect(`/admin/client/${clientId}?ok=sends`);
}

export async function addReply(formData: FormData) {
  await guard();
  const clientId = String(formData.get("client_id") || "");
  const name = String(formData.get("sender_name") || "").trim();
  const company = String(formData.get("sender_company") || "").trim();
  const email = String(formData.get("sender_email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const suggested = String(formData.get("suggested_reply") || "").trim();
  const classification = String(formData.get("classification") || "DEV_QUOTE");
  const role = String(formData.get("via_inbox_role") || "Introduction");

  if (!clientId || !name || !body) redirect(`/admin/client/${clientId}?error=reply`);

  await q(
    `insert into replies (client_id, sender_name, sender_company, sender_email, subject,
                          body, suggested_reply, classification, via_inbox_role)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [clientId, name, company, email, subject, body, suggested, classification, role]
  );

  revalidatePath(`/admin/client/${clientId}`);
  redirect(`/admin/client/${clientId}?ok=reply`);
}
