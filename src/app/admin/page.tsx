import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listClients } from "@/lib/data";
import { createClient, adminLogout } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdmin()) redirect("/admin/login");
  const clients = await listClients();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="border-b border-[#242429] px-6 h-14 flex items-center justify-between">
        <p className="font-extrabold tracking-tight">KONEKTEO — Opérations</p>
        <form action={adminLogout}>
          <button className="text-xs text-gray-400 hover:text-white">Déconnexion</button>
        </form>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
            Clients ({clients.length})
          </h2>
          {clients.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun client. Créez le premier compte à droite, puis générez son lien d&apos;accès.
            </p>
          ) : (
            <ul className="space-y-2">
              {clients.map((c) => (
                <li
                  key={c.id}
                  className="bg-[#121214] border border-[#242429] rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{c.company}</p>
                    <p className="text-xs text-gray-400">
                      {c.contact_name} · {c.email}
                    </p>
                  </div>
                  <a
                    href={`/admin/client/${c.id}`}
                    className="text-xs font-bold text-[#e9ff3b] hover:underline"
                  >
                    Ouvrir →
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-[#121214] border border-[#242429] rounded-2xl p-5 h-fit">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
            Nouveau client
          </h2>
          <form action={createClient} className="space-y-3">
            {[
              { name: "company", label: "Entreprise", placeholder: "Acme SARL" },
              { name: "contact", label: "Contact", placeholder: "Nom du décideur" },
              { name: "email", label: "E-mail", placeholder: "contact@acme.mg" },
              { name: "target", label: "Cible", placeholder: "PME & artisans — Antananarivo" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  required
                  placeholder={f.placeholder}
                  className="w-full rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e9ff3b]"
                />
              </div>
            ))}
            <button className="w-full rounded-lg bg-[#e9ff3b] text-[#0a0a0a] text-sm font-bold py-2.5">
              Créer le client
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
