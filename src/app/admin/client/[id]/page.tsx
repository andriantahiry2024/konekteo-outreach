import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getDashboard, getClientById } from "@/lib/data";
import { q } from "@/lib/db";
import { addInbox, addReply, generateLink, logSends } from "../../actions";

export const dynamic = "force-dynamic";

export default async function ClientConsole({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { link?: string; ok?: string; error?: string };
}) {
  if (!isAdmin()) redirect("/admin/login");

  const client = await getClientById(params.id);
  if (!client) notFound();

  const data = await getDashboard(params.id);
  const inboxRows = await q<{ id: string; role: string; email: string }>(
    `select id, role, email from sender_inboxes where client_id = $1 order by created_at`,
    [params.id]
  );

  const host =
    headers().get("x-forwarded-host") || headers().get("host") || "localhost:3000";
  const proto = headers().get("x-forwarded-proto") || "http";
  const linkUrl = searchParams.link ? `${proto}://${host}/s/${searchParams.link}` : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="border-b border-[#242429] px-6 h-14 flex items-center justify-between">
        <a href="/admin" className="text-xs text-gray-400 hover:text-white">
          ← Tous les clients
        </a>
        <p className="text-sm font-bold">{client.company}</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {searchParams.ok && (
          <p className="text-xs text-[#10b981]">Enregistré : {searchParams.ok}</p>
        )}
        {searchParams.error && (
          <p className="text-xs text-red-400">Échec : {searchParams.error}</p>
        )}

        {linkUrl && (
          <div className="bg-[#121214] border border-[#e9ff3b]/40 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#e9ff3b] mb-2">
              Lien d&apos;accès client (à envoyer par WhatsApp / e-mail)
            </p>
            <code className="block break-all text-xs text-gray-200 bg-[#0a0a0a] border border-[#2c2c34] rounded-lg p-3">
              {linkUrl}
            </code>
            <p className="text-[11px] text-gray-500 mt-2">Valable 30 jours, sans mot de passe.</p>
          </div>
        )}

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Envoyés aujourd'hui", value: data?.metrics.sentToday ?? 0 },
            { label: "Plafond / jour", value: data?.metrics.sentDailyCap ?? 0 },
            { label: "Taux d'ouverture", value: `${data?.metrics.openRatePercent ?? 0}%` },
            { label: "Réponses chaudes", value: data?.metrics.hotRepliesCount ?? 0 },
          ].map((m) => (
            <div key={m.label} className="bg-[#121214] border border-[#242429] rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                {m.label}
              </p>
              <p className="text-2xl font-black text-white mt-1">{m.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="bg-[#121214] border border-[#242429] rounded-2xl p-5">
            <h2 className="text-sm font-bold mb-1">Lien d&apos;accès du client</h2>
            <p className="text-xs text-gray-500 mb-3">
              Génère un lien magique. Aucun e-mail n&apos;est envoyé automatiquement : copiez-le et
              transmettez-le au client.
            </p>
            <form action={generateLink}>
              <input type="hidden" name="client_id" value={client.id} />
              <button className="rounded-lg bg-[#e9ff3b] text-[#0a0a0a] text-xs font-bold px-4 py-2">
                Générer un lien d&apos;accès
              </button>
            </form>
          </div>

          <div className="bg-[#121214] border border-[#242429] rounded-2xl p-5">
            <h2 className="text-sm font-bold mb-3">Ajouter une boîte d&apos;envoi</h2>
            <form action={addInbox} className="space-y-2">
              <input type="hidden" name="client_id" value={client.id} />
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="role"
                  className="rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white"
                >
                  <option>Introduction</option>
                  <option>Relances</option>
                  <option>Suivi</option>
                </select>
                <input
                  name="daily_limit"
                  type="number"
                  defaultValue={35}
                  className="rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white"
                />
              </div>
              <input
                name="email"
                required
                placeholder="contact@domaine-client.com"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
              />
              <input
                name="sender_name"
                required
                placeholder="Nom affiché (ex : Julien)"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
              />
              <button className="rounded-lg bg-[#242429] hover:bg-[#2c2c34] text-xs font-bold px-4 py-2">
                Ajouter la boîte
              </button>
            </form>
          </div>

          <div className="bg-[#121214] border border-[#242429] rounded-2xl p-5">
            <h2 className="text-sm font-bold mb-3">Enregistrer une journée d&apos;envois</h2>
            <form action={logSends} className="space-y-2">
              <input type="hidden" name="client_id" value={client.id} />
              <select
                name="inbox_id"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white"
              >
                <option value="">— Boîte (optionnel) —</option>
                {inboxRows.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.role} · {i.email}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="count"
                  type="number"
                  min={1}
                  required
                  placeholder="Envoyés"
                  className="rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
                />
                <input
                  name="opened"
                  type="number"
                  min={0}
                  defaultValue={0}
                  placeholder="Ouverts"
                  className="rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
                />
              </div>
              <button className="rounded-lg bg-[#242429] hover:bg-[#2c2c34] text-xs font-bold px-4 py-2">
                Enregistrer
              </button>
            </form>
          </div>

          <div className="bg-[#121214] border border-[#242429] rounded-2xl p-5">
            <h2 className="text-sm font-bold mb-3">Ajouter une réponse prospect</h2>
            <form action={addReply} className="space-y-2">
              <input type="hidden" name="client_id" value={client.id} />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="sender_name"
                  required
                  placeholder="Nom du prospect"
                  className="rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
                />
                <input
                  name="sender_company"
                  placeholder="Société"
                  className="rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
                />
              </div>
              <input
                name="sender_email"
                placeholder="E-mail du prospect"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
              />
              <input
                name="subject"
                placeholder="Objet"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
              />
              <textarea
                name="body"
                required
                rows={3}
                placeholder="Message reçu"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
              />
              <textarea
                name="suggested_reply"
                rows={2}
                placeholder="Réponse suggérée au client (optionnel)"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white placeholder:text-gray-600"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="classification"
                  className="rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white"
                >
                  <option value="DEV_QUOTE">Demande de devis</option>
                  <option value="MEETING_REQUEST">Demande de RDV</option>
                  <option value="FOLLOW_UP_LATER">Relancer plus tard</option>
                </select>
                <select
                  name="via_inbox_role"
                  className="rounded-lg bg-[#0a0a0a] border border-[#2c2c34] px-3 py-2 text-xs text-white"
                >
                  <option>Introduction</option>
                  <option>Relances</option>
                  <option>Suivi</option>
                </select>
              </div>
              <button className="rounded-lg bg-[#242429] hover:bg-[#2c2c34] text-xs font-bold px-4 py-2">
                Ajouter la réponse
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
