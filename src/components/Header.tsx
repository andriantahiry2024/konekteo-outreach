"use strict";
import React from "react";
import { ShieldCheck, Target, RefreshCw } from "lucide-react";
import { SenderInbox } from "@/types";

interface HeaderProps {
  inboxes: SenderInbox[];
  onOpenTargetModal: () => void;
  currentTarget: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  inboxes,
  onOpenTargetModal,
  currentTarget,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="border-b border-[#242429] bg-[#0a0a0a]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#e9ff3b] flex items-center justify-center font-extrabold text-[#0a0a0a] text-lg shadow-sm">
            K
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-lg tracking-tight">KONEKTEO</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#18181b] text-[#e9ff3b] border border-[#e9ff3b]/30">
                Piloté par Konekteo
              </span>
            </div>
            <p className="text-xs text-gray-400">Prospection commerciale sans friction technique</p>
          </div>
        </div>

        {/* 3 Secured Inboxes Pills in Header */}
        <div className="hidden lg:flex items-center space-x-2">
          {inboxes.map((inbox) => (
            <div
              key={inbox.id}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#121214] border border-[#242429] text-[11px]"
              title={`${inbox.email} (${inbox.dailySentCount}/${inbox.dailyLimit} envoyés)`}
            >
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse-lime" />
              <span className="text-gray-300 font-medium">{inbox.role}</span>
              <span className="text-gray-500 text-[10px] truncate max-w-[110px]">
                {inbox.email.split("@")[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button: Ajuster ma cible */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-[#18181b] hover:bg-[#242429] border border-[#242429] text-gray-300 transition-colors disabled:opacity-50"
            title="Actualiser les messages"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#e9ff3b]" : ""}`} />
          </button>

          <button
            onClick={onOpenTargetModal}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#e9ff3b] hover:bg-[#d4eb2b] text-[#0a0a0a] text-xs font-bold transition-all shadow-[0_0_15px_rgba(233,255,59,0.25)] hover:shadow-[0_0_20px_rgba(233,255,59,0.4)]"
          >
            <Target className="w-4 h-4 text-[#0a0a0a]" />
            <span>Ajuster ma cible</span>
          </button>
        </div>
      </div>
    </header>
  );
};
