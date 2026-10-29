"use strict";
import React from "react";
import { Play, Pause, Target, Zap, Shield, Sparkles } from "lucide-react";

interface CampaignBannerProps {
  isActive: boolean;
  onToggleActive: () => void;
  onSimulateLead: () => void;
}

export const CampaignBanner: React.FC<CampaignBannerProps> = ({
  isActive,
  onToggleActive,
  onSimulateLead,
}) => {
  return (
    <div className="bg-[#121214] border border-[#242429] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Campaign Details */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isActive ? "bg-[#10b981] animate-pulse-lime" : "bg-gray-500"
            }`}
          />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Système d&apos;acquisition Konekteo : {isActive ? "En cours de prospection" : "En pause"}
          </h2>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#18181b] text-gray-300 border border-[#242429]">
            Zéro usine à gaz
          </span>
        </div>
        <p className="text-xs text-gray-400 flex items-center gap-1.5 flex-wrap">
          <Target className="w-3.5 h-3.5 text-[#e9ff3b] inline" />
          <span>Cible : Décideurs & Dirigeants B2B</span>
          <span className="text-[#242429]">•</span>
          <Shield className="w-3.5 h-3.5 text-[#10b981] inline" />
          <span>Sécurité : Warmup permanent et protection des domaines</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 self-start md:self-auto">
        <button
          onClick={onSimulateLead}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#18181b] hover:bg-[#242429] border border-[#242429] text-xs font-semibold text-gray-200 transition-colors"
          title="Simuler l'arrivée d'une réponse prospect intéressée"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e9ff3b]" />
          <span>Simuler une réponse</span>
        </button>

        <button
          onClick={onToggleActive}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
            isActive
              ? "bg-[#18181b] hover:bg-[#242429] text-gray-200 border border-[#242429]"
              : "bg-[#e9ff3b] hover:bg-[#d4eb2b] text-[#0a0a0a]"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-3.5 h-3.5 text-gray-400" />
              <span>Mettre en pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[#0a0a0a]" />
              <span>Activer la prospection</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
