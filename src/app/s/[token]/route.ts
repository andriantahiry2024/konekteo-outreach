import { NextRequest, NextResponse } from "next/server";
import { resolveMagicLink, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const clientId = await resolveMagicLink(params.token);
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?expired=1", _req.url));
  }
  setSessionCookie(clientId);
  return NextResponse.redirect(new URL("/app", _req.url));
}
