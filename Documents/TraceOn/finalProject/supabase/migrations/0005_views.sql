-- 0005_views.sql
-- Reviewer workflow, notifications and dashboard views.
-- The person who posted a report reviews claims on it (the finder decides
-- who the item belongs to). Admins can also review, for disputes.

-- ---------------------------------------------------------------- review stamp
-- Record who approved/rejected, regardless of what the client sends.
create or replace function public.stamp_claim_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status
     and new.status in ('approved', 'rejected', 'completed')
  then
    new.reviewed_by := auth.uid();
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists claims_stamp_review on public.claims;
create trigger claims_stamp_review
  before update on public.claims
  for each row execute function public.stamp_claim_review();

-- ---------------------------------------------------------------- notifications
-- New claim -> tell the person who posted the report.
create or replace function public.notify_new_claim()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_title text;
  v_name  text;
begin
  select reporter_id, title into v_owner, v_title
  from public.reports
  where id = new.report_id;

  if v_owner is null then
    return new;
  end if;

  select full_name into v_name
  from public.profiles
  where id = new.claimant_id;

  insert into public.notifications (user_id, type, title, body, report_id, claim_id)
  values (
    v_owner,
    'claim',
    'New claim on "' || v_title || '"',
    coalesce(nullif(v_name, ''), 'Someone') || ' says: ' || left(new.message, 140),
    new.report_id,
    new.id
  );

  return new;
end;
$$;

drop trigger if exists claims_notify_owner on public.claims;
create trigger claims_notify_owner
  after insert on public.claims
  for each row execute function public.notify_new_claim();

-- Status change -> tell the claimant.
create or replace function public.notify_claim_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title  text;
  v_header text;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  select title into v_title from public.reports where id = new.report_id;

  v_header := case new.status
                when 'approved'  then 'Your claim was approved'
                when 'rejected'  then 'Your claim was rejected'
                when 'completed' then 'Item handed over'
                else 'Claim updated'
              end;

  insert into public.notifications (user_id, type, title, body, report_id, claim_id)
  values (
    new.claimant_id,
    'claim_status',
    v_header,
    'Report: ' || coalesce(v_title, 'item'),
    new.report_id,
    new.id
  );

  return new;
end;
$$;

drop trigger if exists claims_notify_claimant on public.claims;
create trigger claims_notify_claimant
  after update on public.claims
  for each row execute function public.notify_claim_status();

-- ---------------------------------------------------------------- views
-- These views run as their owner (so they can join profiles), which is why
-- every one of them filters by the caller: owns_report() for reviewers,
-- is_admin() for the admin screens.

create or replace view public.v_claims_to_review as
select
  c.id          as claim_id,
  c.created_at,
  c.message,
  c.secret_detail,
  c.status      as claim_status,
  r.id          as report_id,
  r.title       as report_title,
  r.type        as report_type,
  r.status      as report_status,
  p.id          as claimant_id,
  p.full_name   as claimant_name,
  p.program     as claimant_program,
  p.trust_score as claimant_trust
from public.claims c
join public.reports  r on r.id = c.report_id
join public.profiles p on p.id = c.claimant_id
where c.status = 'pending'
  and public.owns_report(c.report_id);

create or replace view public.v_admin_overview as
select
  (select count(*) from public.reports where status = 'open')                    as open_reports,
  (select count(*) from public.reports where type = 'lost' and status = 'open')  as open_lost,
  (select count(*) from public.reports where type = 'found' and status = 'open') as open_found,
  (select count(*) from public.claims where status = 'pending')                  as pending_claims,
  (select count(*) from public.reports
     where status = 'returned'
       and updated_at >= date_trunc('month', now()))                             as returned_this_month,
  (select count(*) from public.profiles)                                         as total_students,
  (select count(*) from public.notifications where read_at is null)              as unread_notifications
where public.is_admin();

create or replace view public.v_pending_claims as
select
  c.id            as claim_id,
  c.created_at,
  c.message,
  c.secret_detail,
  r.id            as report_id,
  r.title         as report_title,
  r.type          as report_type,
  r.status        as report_status,
  p.id            as claimant_id,
  p.full_name     as claimant_name,
  p.email         as claimant_email,
  p.program       as claimant_program,
  p.trust_score   as claimant_trust
from public.claims c
join public.reports  r on r.id = c.report_id
join public.profiles p on p.id = c.claimant_id
where c.status = 'pending'
  and public.is_admin();

revoke all on public.v_claims_to_review from anon;
revoke all on public.v_admin_overview   from anon;
revoke all on public.v_pending_claims   from anon;

grant select on public.v_claims_to_review to authenticated;
grant select on public.v_admin_overview   to authenticated;
grant select on public.v_pending_claims   to authenticated;
