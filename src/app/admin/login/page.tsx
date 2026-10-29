import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { adminLogin } from "../actions";

export const dynamic = "force-dynamic";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (isAdmin()) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action={adminLogin}
        className="w-full max-w-sm bg-[#121214] border border-[#242429] rounded-2xl p-8 space-y-4"
      >
        <div>
          <p className="font-extrabold text-white tracking-tight">KONEKTEO — Console interne</p>
          <p className="text-xs text-gray-400 mt-1">Accès réservé à l&apos;équipe.</p>
        </div>
        <input
          type="password"
          name="password"
          required
          placeholder="Mot de passe opérateur"
          className="w-full rounded-xl bg-[#0a0a0a] border border-[#2c2c34] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e9ff3b]"
        />
        {searchParams.error && (
          <p className="text-xs text-red-400">Mot de passe incorrect.</p>
        )}
        <button
          type="submit"
          className="w-full rounded-xl bg-[#e9ff3b] text-[#0a0a0a] text-sm font-bold py-3"
        >
          Entrer
        </button>
      </form>
    </div>
  );
}
