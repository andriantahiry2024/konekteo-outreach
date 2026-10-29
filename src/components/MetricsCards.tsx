"use strict";
import React from "react";
import { Send, Eye, Flame } from "lucide-react";
import { LiveMetrics } from "@/types";

interface MetricsCardsProps {
  metrics: LiveMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Metric 1: Envoyés */}
      <div className="bg-[#121214] border border-[#242429] rounded-2xl p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
            E-mails envoyés aujourd&apos;hui
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#242429] flex items-center justify-center text-gray-300">
            <Send className="w-4 h-4 text-[#e9ff3b]" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {metrics.sentToday}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-gray-400">
            / {metrics.sentDailyCap}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block mr-1.5" />
          Plafond d&apos;envoi réparti sur vos boîtes
        </p>
      </div>

      {/* Metric 2: Ouverts */}
      <div className="bg-[#121214] border border-[#242429] rounded-2xl p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
            E-mails ouverts par les décideurs
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#242429] flex items-center justify-center text-gray-300">
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
        </div>
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {metrics.openedCount}
          </span>
          <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
            {metrics.openRatePercent}% d&apos;ouverture
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Taux d&apos;ouverture mesuré sur 30 jours
        </p>
      </div>

      {/* Metric 3: Réponses Chaudes */}
      <div className="bg-[#121214] border border-[#e9ff3b]/40 rounded-2xl p-6 relative overflow-hidden group bg-gradient-to-br from-[#121214] to-[#18181b]">
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#e9ff3b]/10 rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-[#e9ff3b] font-bold">
            Réponses chaudes reçues
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#e9ff3b]/20 flex items-center justify-center text-[#e9ff3b]">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl sm:text-5xl font-black text-[#e9ff3b] tracking-tight">
            {metrics.hotRepliesCount}
          </span>
          <span className="text-xs font-bold text-[#0a0a0a] bg-[#e9ff3b] px-2 py-0.5 rounded-full">
            Devis &amp; RDV
          </span>
        </div>
        <p className="text-xs text-gray-300 mt-2">
          Prospects prêts à échanger cette semaine
        </p>
      </div>
    </section>
  );
};
