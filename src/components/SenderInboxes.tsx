"use strict";
import React from "react";
import { Mail, CheckCircle2, Shield } from "lucide-react";
import { SenderInbox } from "@/types";

interface SenderInboxesProps {
  inboxes: SenderInbox[];
}

export const SenderInboxes: React.FC<SenderInboxesProps> = ({ inboxes }) => {
  return (
    <div className="bg-[#121214] border border-[#242429] rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              {inboxes.length > 1
                ? `Vos ${inboxes.length} adresses d'expédition sécurisées`
                : "Votre adresse d'expédition sécurisée"}
            </h3>
            <span className="text-[11px] font-semibold bg-[#10b981]/15 text-[#10b981] px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#10b981]/30">
              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
              Domaine client protégé
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Chaque adresse a un rôle spécifique pour protéger votre domaine et maximiser les retours
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-gray-300 bg-[#18181b] px-3 py-1.5 rounded-xl border border-[#242429] self-start sm:self-auto font-medium">
          <Shield className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Protection anti-spam active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {inboxes.map((inbox) => {
          const usagePercent = Math.round((inbox.dailySentCount / inbox.dailyLimit) * 100);

          return (
            <div
              key={inbox.id}
              className="bg-[#18181b] border border-[#242429] rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#242429] flex items-center justify-center text-gray-300">
                    <Mail className="w-4 h-4 text-[#e9ff3b]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>Rôle : {inbox.role}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[170px]" title={inbox.email}>
                      {inbox.email}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                  {inbox.statusLabel}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#242429] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Cadence sécurisée</span>
                  <span className="font-bold text-white">
                    {inbox.dailySentCount} / {inbox.dailyLimit} messages
                  </span>
                </div>

                <div className="w-full bg-[#242429] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#e9ff3b] h-full rounded-full transition-all duration-300"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
