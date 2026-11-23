-- 0001_init.sql
-- TraceOn schema v1: enums, tables, indexes.
-- Run in Supabase SQL Editor (or `supabase db push`).

-- ---------------------------------------------------------------- enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_type') then
    create type public.report_type as enum ('lost', 'found');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_status') then
    create type public.report_status as enum ('open', 'matched', 'claimed', 'returned', 'closed');
  end if;
  if not exists (select 1 from pg_type where typname = 'claim_status') then
    create type public.claim_status as enum ('pending', 'approved', 'rejected', 'completed');
  end if;
end
$$;

-- ---------------------------------------------------------------- profiles
-- 1:1 with auth.users. Created by the handle_new_user() trigger (0002).
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  email       text not null,
  student_no  text unique,
  program     text,
  campus      text not null default 'CvSU Main Campus',
  role        public.user_role not null default 'student',
  trust_score integer not null default 0 check (trust_score between 0 and 100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- lookups
create table if not exists public.categories (
  id    smallint generated always as identity primary key,
  slug  text not null unique,
  label text not null,
  icon  text not null default 'pricetag-outline'
);

-- Seeded from data/campusMap.js BUILDINGS.
create table if not exists public.report_locations (
  id       smallint generated always as identity primary key,
  code     text not null unique,
  name     text not null,
  lat      double precision not null check (lat between -90 and 90),
  lon      double precision not null check (lon between -180 and 180),
  priority smallint not null default 3
);

-- ---------------------------------------------------------------- reports
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  type        public.report_type not null,
  status      public.report_status not null default 'open',
  title       text not null check (char_length(btrim(title)) between 3 and 120),
  description text not null default '',
  category_id smallint references public.categories (id) on delete set null,
  location_id smallint references public.report_locations (id) on delete set null,
  lat         double precision not null check (lat between -90 and 90),
  lon         double precision not null check (lon between -180 and 180),
  occurred_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Full-text search column, kept in sync automatically by Postgres.
alter table public.reports
  add column if not exists search tsvector
  generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) stored;

-- ---------------------------------------------------------------- claims
create table if not exists public.claims (
  id            uuid primary key default gen_random_uuid(),
  report_id     uuid not null references public.reports (id) on delete cascade,
  claimant_id   uuid not null references public.profiles (id) on delete cascade,
  message       text not null default '' check (char_length(message) <= 800),
  -- Something only the real owner would know (a scratch, a sticker, contents).
  secret_detail text,
  status        public.claim_status not null default 'pending',
  reviewed_by   uuid references public.profiles (id) on delete set null,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (report_id, claimant_id)
);

-- ---------------------------------------------------------------- saved / notifications
create table if not exists public.saved_reports (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  report_id  uuid not null references public.reports (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, report_id)
);

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  type       text not null check (type in ('claim', 'claim_status', 'match', 'system')),
  title      text not null,
  body       text,
  report_id  uuid references public.reports (id) on delete cascade,
  claim_id   uuid references public.claims (id) on delete cascade,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- indexes
create index if not exists reports_status_created_idx on public.reports (status, created_at desc);
create index if not exists reports_type_status_idx    on public.reports (type, status);
create index if not exists reports_reporter_idx       on public.reports (reporter_id, created_at desc);
create index if not exists reports_search_idx         on public.reports using gin (search);
create index if not exists reports_location_idx        on public.reports (location_id);

create index if not exists claims_report_idx   on public.claims (report_id);
create index if not exists claims_claimant_idx on public.claims (claimant_id, created_at desc);

create index if not exists notifications_user_unread_idx on public.notifications (user_id, read_at);
create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);
