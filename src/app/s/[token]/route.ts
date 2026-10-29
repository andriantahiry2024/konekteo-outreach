import { NextRequest, NextResponse } from "next/server";
import { resolveMagicLink, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

function baseUrl(req: NextRequest) {
  const host =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? req.nextUrl.host;
  const proto =
    req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "") ?? "https";
  return `${proto}://${host}`;
}

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const clientId = await resolveMagicLink(params.token);
  if (!clientId) {
    return NextResponse.redirect(`${baseUrl(req)}/login?expired=1`);
  }
  setSessionCookie(clientId);
  return NextResponse.redirect(`${baseUrl(req)}/app`);
}
