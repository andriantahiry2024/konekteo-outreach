-- Konekteo — socle réel (service mode)
create extension if not exists "pgcrypto";

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  email text not null unique,
  target_label text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists magic_links (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists sender_inboxes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  role text not null,
  email text not null,
  sender_name text not null,
  daily_limit int not null default 35,
  health_score int not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists sends (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  inbox_id uuid references sender_inboxes(id) on delete set null,
  prospect_name text,
  prospect_company text,
  prospect_email text,
  sent_at timestamptz not null default now(),
  opened_at timestamptz
);

create table if not exists replies (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  sender_name text not null,
  sender_company text,
  sender_email text,
  subject text,
  body text not null,
  suggested_reply text,
  our_reply text,
  classification text not null default 'DEV_QUOTE',
  handled boolean not null default false,
  via_inbox_role text,
  received_at timestamptz not null default now()
);

create index if not exists idx_sends_client_date on sends (client_id, sent_at desc);
create index if not exists idx_replies_client_date on replies (client_id, received_at desc);
create index if not exists idx_magic_hash on magic_links (token_hash);
