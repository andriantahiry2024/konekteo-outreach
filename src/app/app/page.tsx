import { redirect } from "next/navigation";
import { currentClientId } from "@/lib/auth";
import { getDashboard } from "@/lib/data";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const clientId = currentClientId();
  if (!clientId) redirect("/login");

  const data = await getDashboard(clientId);
  if (!data) redirect("/logout");

  return <Dashboard data={data} />;
}
