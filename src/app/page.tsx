import { redirect } from "next/navigation";
import { currentClientId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function Home() {
  const clientId = currentClientId();
  redirect(clientId ? "/app" : "/login");
}
