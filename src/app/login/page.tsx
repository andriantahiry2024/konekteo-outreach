import { requestLink } from "./actions";

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#121214] border border-[#242429] rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#e9ff3b] flex items-center justify-center font-extrabold text-[#0a0a0a] text-lg">
            K
          </div>
          <div>
            <p className="font-extrabold text-white tracking-tight">KONEKTEO</p>
            <p className="text-xs text-gray-400">Espace de suivi client</p>
          </div>
        </div>

        {searchParams.sent ? (
          <div className="space-y-3">
            <p className="text-sm font-bold text-[#e9ff3b]">Demande enregistrée.</p>
            <p className="text-sm text-gray-300">
              Si cette adresse correspond à un compte actif, votre lien d&apos;accès a été généré.
              Il vous est transmis par e-mail ou WhatsApp par votre interlocuteur Konekteo.
            </p>
            <p className="text-xs text-gray-500">
              Ce lien est valable 30 jours et ne demande aucun mot de passe.
            </p>
            <a href="/login" className="inline-block text-xs text-gray-400 underline">
              Retour
            </a>
          </div>
        ) : (
          <form action={requestLink} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Votre adresse e-mail
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="vous@entreprise.com"
                className="w-full rounded-xl bg-[#0a0a0a] border border-[#2c2c34] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e9ff3b]"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#e9ff3b] hover:bg-[#d4eb2b] text-[#0a0a0a] text-sm font-bold py-3 transition-colors"
            >
              Recevoir mon lien d&apos;accès
            </button>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Aucun mot de passe à retenir. Vous ouvrez votre lien, vous voyez vos chiffres réels
              et les réponses de vos prospects.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
