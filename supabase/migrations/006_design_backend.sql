-- Support des écrans du handoff de design : journal d'audit, statut des testeurs de
-- connexion, dernier test WhatsApp par client, série hebdomadaire pour le graphique
-- d'activité du dashboard. Le secret 2FA (TOTP) est stocké dans `settings`
-- (admin_totp_secret / admin_totp_enabled) : un seul compte admin, pas de table dédiée.
begin;

create table if not exists public.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  actor      text not null,
  action     text not null,
  detail     jsonb,
  client_id  uuid references public.clients(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created on public.audit_logs(created_at desc);
alter table public.audit_logs enable row level security;
revoke all on public.audit_logs from public, anon, authenticated;
grant select, insert on public.audit_logs to service_role;

create table if not exists public.integration_tests (
  key        text primary key,
  status     text not null,
  detail     text,
  tested_at  timestamptz not null default now()
);
alter table public.integration_tests enable row level security;
revoke all on public.integration_tests from public, anon, authenticated;
grant select, insert, update on public.integration_tests to service_role;

alter table public.clients add column if not exists wa_last_test_at timestamptz;
alter table public.clients add column if not exists wa_last_test_status text;

create or replace function public.weekly_activity()
returns table(week_start date, sent bigint, replies bigint, reservations bigint)
language sql set search_path = '' as $$
  with weeks as (
    select (date_trunc('week', now())::date - (n * 7)) as week_start
    from generate_series(0, 11) as n
  )
  select
    w.week_start,
    (select count(*) from public.messages m where m.direction = 'out'
       and m.status in ('sent','delivered','read')
       and date_trunc('week', m.created_at)::date = w.week_start),
    (select count(*) from public.messages m where m.direction = 'in'
       and date_trunc('week', m.created_at)::date = w.week_start),
    (select count(*) from public.reservations r
       where date_trunc('week', r.created_at)::date = w.week_start)
  from weeks w
  order by w.week_start
$$;
revoke all on function public.weekly_activity() from public, anon, authenticated;
grant execute on function public.weekly_activity() to service_role;

create or replace function public.client_aggregates()
returns table(client_id uuid, contacts_count bigint, campaigns_count bigint, reservations_count bigint, last_activity timestamptz)
language sql set search_path = '' as $$
  select c.id,
    (select count(*) from public.contacts x where x.client_id = c.id),
    (select count(*) from public.campaigns x where x.client_id = c.id),
    (select count(*) from public.reservations x where x.client_id = c.id),
    greatest(
      c.created_at,
      (select max(created_at) from public.contacts x where x.client_id = c.id),
      (select max(created_at) from public.campaigns x where x.client_id = c.id),
      (select max(created_at) from public.messages x where x.client_id = c.id)
    )
  from public.clients c
$$;
revoke all on function public.client_aggregates() from public, anon, authenticated;
grant execute on function public.client_aggregates() to service_role;

commit;
