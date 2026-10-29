"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { MetricsCards } from "@/components/MetricsCards";
import { SenderInboxes } from "@/components/SenderInboxes";
import { UnifiedInbox } from "@/components/UnifiedInbox";
import { TargetModal } from "@/components/TargetModal";
import type { DashboardData } from "@/lib/data";
import { Target, LogOut } from "lucide-react";

export function Dashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();

  const refresh = () => startRefresh(() => router.refresh());

  const handleToggleHandled = async (id: string) => {
    await fetch(`/api/replies/${id}/handled`, { method: "POST" });
    refresh();
  };

  const handleSendReply = async (id: string, text: string) => {
    await fetch(`/api/replies/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    refresh();
  };

  const handleSaveTarget = async (newTarget: string) => {
    await fetch("/api/target", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: newTarget }),
    });
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col font-sans">
      <Header
        inboxes={data.inboxes}
        onOpenTargetModal={() => setIsTargetModalOpen(true)}
        currentTarget={data.client.target_label || "Cible en cours de définition"}
        onRefresh={refresh}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="bg-[#121214] border border-[#242429] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#e9ff3b]/10 flex items-center justify-center text-[#e9ff3b]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Bonjour {data.client.contact_name} — {data.client.company}
              </span>
              <span className="text-sm font-extrabold text-white">
                {data.client.target_label || "Aucune cible active pour le moment"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <a
              href="/logout"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-[#242429] border border-[#242429] text-xs font-semibold text-gray-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quitter</span>
            </a>
            <button
              onClick={() => setIsTargetModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#e9ff3b] hover:bg-[#d4eb2b] text-[#0a0a0a] text-xs font-bold transition-all shadow-sm"
            >
              🎯 Ajuster ma cible
            </button>
          </div>
        </section>

        {!data.hasActivity && (
          <section className="border border-dashed border-[#3a3a42] rounded-2xl p-6 text-center">
            <p className="text-sm font-bold text-white">Votre prospection démarre aujourd&apos;hui.</p>
            <p className="text-xs text-gray-400 mt-1">
              Aucun chiffre n&apos;est inventé ici : dès le premier e-mail envoyé par notre équipe,
              vos statistiques réelles apparaîtront sur cette page.
            </p>
          </section>
        )}

        <MetricsCards metrics={data.metrics} />

        {data.inboxes.length === 0 ? (
          <section className="bg-[#121214] border border-[#242429] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white">Boîtes d&apos;envoi</h3>
            <p className="text-xs text-gray-400 mt-1">
              Aucune adresse d&apos;expédition n&apos;est encore branchée sur votre compte.
              Notre équipe la configure dans les 24 h qui suivent la validation de votre offre.
            </p>
          </section>
        ) : (
          <SenderInboxes inboxes={data.inboxes} />
        )}

        <UnifiedInbox
          messages={data.messages}
          onToggleHandled={handleToggleHandled}
          onSendReply={handleSendReply}
        />
      </main>

      <footer className="border-t border-[#1e1e24] py-6 text-center text-xs text-gray-500">
        <p>Konekteo • Prospection commerciale opérée pour vous • Données réelles</p>
      </footer>

      <TargetModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentTarget={data.client.target_label}
        onSaveTarget={handleSaveTarget}
      />
    </div>
  );
}
