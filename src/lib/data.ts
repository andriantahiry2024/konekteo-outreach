import { q } from "./db";
import type {
  LiveMetrics,
  MessageClassification,
  ProspectMessage,
  SenderInbox,
} from "@/types";

export type Client = {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  target_label: string;
  status: string;
  created_at: string;
};

export async function getClientById(id: string) {
  const rows = await q<Client>(`select * from clients where id = $1 limit 1`, [id]);
  return rows[0] ?? null;
}

export async function listClients() {
  return q<Client>(`select * from clients order by created_at desc`);
}

function humanize(date: Date) {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

const ACTION_LABEL: Record<MessageClassification, string> = {
  MEETING_REQUEST: "Confirmer RDV",
  DEV_QUOTE: "Envoyer devis",
  FOLLOW_UP_LATER: "Programmer relance",
};

export type DashboardData = {
  client: Client;
  metrics: LiveMetrics;
  inboxes: SenderInbox[];
  messages: ProspectMessage[];
  hasActivity: boolean;
};

export async function getDashboard(clientId: string): Promise<DashboardData | null> {
  const client = await getClientById(clientId);
  if (!client) return null;

  const [sentToday] = await q<{ n: string }>(
    `select count(*)::text as n from sends
     where client_id = $1 and sent_at >= date_trunc('day', now())`,
    [clientId]
  );

  const [cap] = await q<{ n: string }>(
    `select coalesce(sum(daily_limit), 0)::text as n from sender_inboxes where client_id = $1`,
    [clientId]
  );

  const [window30] = await q<{ total: string; opened: string }>(
    `select count(*)::text as total,
            count(*) filter (where opened_at is not null)::text as opened
     from sends
     where client_id = $1 and sent_at >= now() - interval '30 days'`,
    [clientId]
  );

  const [hot] = await q<{ n: string }>(
    `select count(*)::text as n from replies
     where client_id = $1 and classification <> 'FOLLOW_UP_LATER'
       and received_at >= now() - interval '30 days'`,
    [clientId]
  );

  const total = Number(window30?.total ?? 0);
  const opened = Number(window30?.opened ?? 0);

  const metrics: LiveMetrics = {
    sentToday: Number(sentToday?.n ?? 0),
    sentDailyCap: Number(cap?.n ?? 0),
    openedCount: opened,
    openRatePercent: total > 0 ? Math.round((opened / total) * 1000) / 10 : 0,
    hotRepliesCount: Number(hot?.n ?? 0),
  };

  const inboxRows = await q<{
    id: string;
    role: string;
    email: string;
    sender_name: string;
    health_score: number;
    daily_limit: number;
    sent_today: string;
  }>(
    `select i.id, i.role, i.email, i.sender_name, i.health_score, i.daily_limit,
            count(s.id) filter (where s.sent_at >= date_trunc('day', now()))::text as sent_today
     from sender_inboxes i
     left join sends s on s.inbox_id = i.id
     where i.client_id = $1
     group by i.id
     order by i.created_at asc`,
    [clientId]
  );

  const inboxes: SenderInbox[] = inboxRows.map((i) => ({
    id: i.id,
    role: i.role as SenderInbox["role"],
    email: i.email,
    senderName: i.sender_name,
    healthScore: i.health_score,
    dailySentCount: Number(i.sent_today),
    dailyLimit: i.daily_limit,
    statusLabel: `${i.health_score}% opérationnel`,
  }));

  const replyRows = await q<{
    id: string;
    sender_name: string;
    sender_company: string | null;
    sender_email: string | null;
    subject: string | null;
    body: string;
    suggested_reply: string | null;
    classification: MessageClassification;
    handled: boolean;
    via_inbox_role: string | null;
    received_at: Date;
  }>(
    `select id, sender_name, sender_company, sender_email, subject, body,
            suggested_reply, classification, handled, via_inbox_role, received_at
     from replies where client_id = $1 order by received_at desc`,
    [clientId]
  );

  const messages: ProspectMessage[] = replyRows.map((r) => ({
    id: r.id,
    senderName: r.sender_name,
    senderCompany: r.sender_company ?? "",
    senderEmail: r.sender_email ?? "",
    receivedAt: humanize(new Date(r.received_at)),
    subject: r.subject ?? "Réponse à notre message",
    preview: r.body.slice(0, 140),
    fullContent: r.body,
    classification: r.classification,
    handled: r.handled,
    viaInboxRole: (r.via_inbox_role as ProspectMessage["viaInboxRole"]) ?? "Introduction",
    suggestedReply: r.suggested_reply ?? undefined,
    primaryActionLabel: ACTION_LABEL[r.classification] ?? "Répondre",
  }));

  const [activity] = await q<{ n: string }>(
    `select (select count(*) from sends where client_id = $1)
          + (select count(*) from replies where client_id = $1) as n`,
    [clientId]
  );

  return {
    client,
    metrics,
    inboxes,
    messages,
    hasActivity: Number(activity?.n ?? 0) > 0,
  };
}
