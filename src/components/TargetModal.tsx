"use strict";
import React, { useState } from "react";
import { X, Check, Target, ShieldCheck, Sparkles } from "lucide-react";

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: string;
  onSaveTarget: (newTarget: string) => void;
}

export const TargetModal: React.FC<TargetModalProps> = ({
  isOpen,
  onClose,
  currentTarget,
  onSaveTarget,
}) => {
  const [sector, setSector] = useState("PME du bâtiment, Artisans & Commerçants");
  const [geoZone, setGeoZone] = useState("France entière (ou Île-de-France)");
  const [valueProp, setValueProp] = useState("Obtenir plus de chantiers sans prospecter soi-même");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTarget(`${sector} • ${geoZone}`);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121214] border border-[#242429] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#18181b]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#e9ff3b]/10 flex items-center justify-center text-[#e9ff3b]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Ajuster ma cible B2B</h3>
            <p className="text-xs text-gray-400">Modifiez votre cible en 3 questions simples sans technique</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question 1 */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              1. Quel métier ou secteur cibler ?
            </label>
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-[#18181b] border border-[#242429] focus:border-[#e9ff3b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              placeholder="Ex : Plombiers, Notaires, Agences Web..."
              required
            />
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              2. Zone géographique ?
            </label>
            <input
              type="text"
              value={geoZone}
              onChange={(e) => setGeoZone(e.target.value)}
              className="w-full bg-[#18181b] border border-[#242429] focus:border-[#e9ff3b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              placeholder="Ex : Île-de-France, Rhône-Alpes, France entière..."
              required
            />
          </div>

          {/* Question 3 */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              3. En un mot, votre promesse principale ?
            </label>
            <input
              type="text"
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
              className="w-full bg-[#18181b] border border-[#242429] focus:border-[#e9ff3b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              placeholder="Ex : Gain de temps, Réduction des coûts, Plus de clients..."
              required
            />
          </div>

          {/* Bloc de réassurance (A/B Test Feedback) */}
          <div className="bg-[#18181b] border border-[#242429] rounded-xl p-3.5 space-y-1.5 text-[11px] text-gray-400">
            <div className="flex items-center space-x-1.5 text-gray-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Garanties Konekteo :</span>
            </div>
            <p>• Entreprises vérifiées automatiquement (pas de faux contacts).</p>
            <p>• Messages 1-to-1 rédigés comme un humain sans spam.</p>
            <p>• Votre boîte email personnelle reste 100% isolée et protégée.</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#e9ff3b] hover:bg-[#d4eb2b] text-[#0a0a0a] text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-[#0a0a0a]" />
                  <span>Cible actualisée !</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0a0a0a]" />
                  <span>Valider ma cible</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
