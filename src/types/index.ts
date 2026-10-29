export type MessageClassification = "DEV_QUOTE" | "MEETING_REQUEST" | "FOLLOW_UP_LATER";

export interface ProspectMessage {
  id: string;
  senderName: string;
  senderCompany: string;
  senderEmail: string;
  receivedAt: string;
  subject: string;
  preview: string;
  fullContent: string;
  classification: MessageClassification;
  handled: boolean;
  viaInboxRole: "Introduction" | "Relances" | "Suivi";
  suggestedReply?: string;
  primaryActionLabel: string;
}

export interface SenderInbox {
  id: string;
  role: "Introduction" | "Relances" | "Suivi";
  email: string;
  senderName: string;
  healthScore: number; // e.g. 100%
  dailySentCount: number;
  dailyLimit: number; // e.g. 35
  statusLabel: string;
}

export interface LiveMetrics {
  sentToday: number;
  sentDailyCap: number;
  openedCount: number;
  openRatePercent: number;
  hotRepliesCount: number;
}
