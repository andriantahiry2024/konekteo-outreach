"use server";

import { redirect } from "next/navigation";
import { q } from "@/lib/db";
import { createMagicLink } from "@/lib/auth";

export async function requestLink(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (email) {
    const rows = await q<{ id: string }>(
      `select id from clients where lower(email) = $1 and status = 'active' limit 1`,
      [email]
    );
    if (rows[0]) await createMagicLink(rows[0].id);
  }

  redirect("/login?sent=1");
}
