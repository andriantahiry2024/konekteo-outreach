"use strict";
import React, { useState } from "react";
import { MessageSquare, Check, Sparkles, Send, Clock, ArrowRight } from "lucide-react";
import { ProspectMessage, MessageClassification } from "@/types";

interface UnifiedInboxProps {
  messages: ProspectMessage[];
  onToggleHandled: (id: string) => void;
  onSendReply: (id: string, text: string) => void;
}

export const UnifiedInbox: React.FC<UnifiedInboxProps> = ({
  messages,
  onToggleHandled,
  onSendReply,
}) => {
  const [filter, setFilter] = useState<"ALL" | MessageClassification>("ALL");
  const [selectedMessageId, setSelectedMessageId] = useState<string>(messages[0]?.id || "");
  const [editedReply, setEditedReply] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const filteredMessages = messages.filter((msg) => {
    if (filter === "ALL") return true;
    return msg.classification === filter;
  });

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || filteredMessages[0];

  const handleSelect = (msg: ProspectMessage) => {
    setSelectedMessageId(msg.id);
    setEditedReply(msg.suggestedReply || "");
  };

  const handleSend = () => {
    if (!selectedMessage) return;
    const replyToSend = editedReply || selectedMessage.suggestedReply || "";
    onSendReply(selectedMessage.id, replyToSend);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getStatusBadge = (classification: MessageClassification) => {
    switch (classification) {
      case "MEETING_REQUEST":
        return {
          label: "🔥 Rendez-vous demandé",
          className: "bg-[#e9ff3b]/15 text-[#e9ff3b] border border-[#e9ff3b]/30",
        };
      case "DEV_QUOTE":
        return {
          label: "📄 Devis demandé",
          className: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
        };
      case "FOLLOW_UP_LATER":
        return {
          label: "⏳ En attente de relance",
          className: "bg-neutral-800 text-neutral-400 border border-neutral-700",
        };
    }
  };

  return (
    <div className="bg-[#121214] border border-[#242429] rounded-2xl overflow-hidden shadow-xl">
      {/* Header & Filter Tabs */}
      <div className="p-4 sm:p-5 border-b border-[#242429] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <MessageSquare className="w-5 h-5 text-[#e9ff3b]" />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Messages Reçus &amp; Réponses Chaudes
            </h2>
            <p className="text-xs text-gray-400">Triage automatique sans jargon • Réponses en 1 clic</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "ALL"
                ? "bg-[#e9ff3b] text-[#0a0a0a]"
                : "bg-[#18181b] text-gray-300 hover:bg-[#242429]"
            }`}
          >
            Tous ({messages.length})
          </button>
          <button
            onClick={() => setFilter("MEETING_REQUEST")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "MEETING_REQUEST"
                ? "bg-[#e9ff3b] text-[#0a0a0a]"
                : "bg-[#18181b] text-gray-300 hover:bg-[#242429]"
            }`}
          >
            🔥 RDV demandés ({messages.filter((m) => m.classification === "MEETING_REQUEST").length})
          </button>
          <button
            onClick={() => setFilter("DEV_QUOTE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "DEV_QUOTE"
                ? "bg-[#e9ff3b] text-[#0a0a0a]"
                : "bg-[#18181b] text-gray-300 hover:bg-[#242429]"
            }`}
          >
            📄 Devis demandés ({messages.filter((m) => m.classification === "DEV_QUOTE").length})
          </button>
          <button
            onClick={() => setFilter("FOLLOW_UP_LATER")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "FOLLOW_UP_LATER"
                ? "bg-[#e9ff3b] text-[#0a0a0a]"
                : "bg-[#18181b] text-gray-300 hover:bg-[#242429]"
            }`}
          >
            ⏳ Plus tard ({messages.filter((m) => m.classification === "FOLLOW_UP_LATER").length})
          </button>
        </div>
      </div>

      {/* Grid: Left list, Right detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 border-r border-[#242429] divide-y divide-[#1e1e24] overflow-y-auto max-h-[560px]">
          {filteredMessages.length === 0 && (
            <div className="p-6 text-xs text-gray-500 leading-relaxed">
              Aucune réponse pour l&apos;instant. Vos vrais messages apparaîtront ici dès qu&apos;un
              prospect vous répondra.
            </div>
          )}

          {filteredMessages.map((msg) => {
            const isSelected = selectedMessage?.id === msg.id;
            const badge = getStatusBadge(msg.classification);

            return (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[#18181b] border-l-4 border-[#e9ff3b]"
                    : "hover:bg-[#151518]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{msg.senderName}</span>
                    <span className="text-[11px] text-gray-400 truncate max-w-[130px]">
                      {msg.senderCompany}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1 inline" />
                    {msg.receivedAt}
                  </span>
                </div>

                <div className="mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {msg.preview}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Via boîte {msg.viaInboxRole}</span>
                  <span className="font-semibold text-[#e9ff3b] flex items-center">
                    {msg.primaryActionLabel} <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Detail & 1-Click Action (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-[#0e0e10] flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="pb-4 border-b border-[#242429] flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {selectedMessage.subject}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    De : <span className="font-bold text-white">{selectedMessage.senderName}</span> • {selectedMessage.senderCompany}
                  </p>
                </div>

                <button
                  onClick={() => onToggleHandled(selectedMessage.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    selectedMessage.handled
                      ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30"
                      : "bg-[#18181b] text-gray-300 hover:text-white border border-[#242429]"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedMessage.handled ? "Traité" : "Marquer comme traité"}</span>
                </button>
              </div>

              {/* Message Content */}
              <div className="bg-[#121214] border border-[#242429] rounded-xl p-4 text-xs text-gray-200 leading-relaxed whitespace-pre-line font-sans">
                {selectedMessage.fullContent}
              </div>

              {/* 1-Click Action Box */}
              <div className="bg-[#18181b] border border-[#e9ff3b]/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#e9ff3b]" />
                    <span className="text-xs font-bold text-white">
                      Réponse suggérée en 1 clic
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">Rédigé sur-mesure • Prêt à envoyer</span>
                </div>

                <textarea
                  value={editedReply || selectedMessage.suggestedReply || ""}
                  onChange={(e) => setEditedReply(e.target.value)}
                  rows={4}
                  className="w-full bg-[#121214] border border-[#242429] focus:border-[#e9ff3b] rounded-lg p-3 text-xs text-gray-200 focus:outline-none resize-none leading-relaxed font-sans"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-400">
                    Réponse enregistrée dans votre historique Konekteo
                  </span>

                  <button
                    onClick={handleSend}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#e9ff3b] hover:bg-[#d4eb2b] text-[#0a0a0a] text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isCopied ? "Réponse enregistrée" : selectedMessage.primaryActionLabel}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              Sélectionnez un message pour y répondre
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
