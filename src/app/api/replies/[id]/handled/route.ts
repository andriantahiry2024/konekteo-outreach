import { NextRequest, NextResponse } from "next/server";
import { currentClientId } from "@/lib/auth";
import { q } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = currentClientId();
  if (!clientId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await q(
    `update replies set handled = not handled
     where id = $1 and client_id = $2`,
    [params.id, clientId]
  );

  return NextResponse.json({ ok: true });
}
