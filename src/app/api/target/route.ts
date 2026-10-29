import { NextRequest, NextResponse } from "next/server";
import { currentClientId } from "@/lib/auth";
import { q } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const clientId = currentClientId();
  if (!clientId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { target?: string };
  const target = (body.target || "").trim().slice(0, 200);
  if (!target) return NextResponse.json({ error: "empty" }, { status: 400 });

  await q(`update clients set target_label = $1 where id = $2`, [target, clientId]);

  return NextResponse.json({ ok: true });
}
