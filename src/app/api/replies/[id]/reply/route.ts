import { NextRequest, NextResponse } from "next/server";
import { currentClientId } from "@/lib/auth";
import { q } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = currentClientId();
  if (!clientId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { text?: string };
  const text = (body.text || "").trim();
  if (!text) return NextResponse.json({ error: "empty" }, { status: 400 });

  await q(
    `update replies set our_reply = $1, handled = true
     where id = $2 and client_id = $3`,
    [text, params.id, clientId]
  );

  return NextResponse.json({ ok: true });
}
