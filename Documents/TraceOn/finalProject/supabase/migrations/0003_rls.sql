-- 0003_rls.sql
-- Row Level Security: who may read/write which rows.

-- ---------------------------------------------------------------- helpers
-- Used by the claims policies so the check does not depend on reports' own RLS.
create or replace function public.owns_report(p_report uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.reports
    where id = p_report
      and reporter_id = auth.uid()
  );
$$;

revoke all on function public.owns_report(uuid) from public;
grant execute on function public.owns_report(uuid) to authenticated;

-- Students edit their own profile but must not promote themselves to admin.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and coalesce(public.is_admin(), false) = false
     and current_user not in ('postgres', 'supabase_admin', 'service_role')
  then
    raise exception 'Only admins can change account roles'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------- enable RLS
alter table public.profiles         enable row level security;
alter table public.categories       enable row level security;
alter table public.report_locations enable row level security;
alter table public.reports          enable row level security;
alter table public.claims           enable row level security;
alter table public.saved_reports    enable row level security;
alter table public.notifications    enable row level security;

-- ---------------------------------------------------------------- profiles
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------- lookups
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories
  for select to authenticated
  using (true);

drop policy if exists locations_read on public.report_locations;
create policy locations_read on public.report_locations
  for select to authenticated
  using (true);

drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists locations_admin_write on public.report_locations;
create policy locations_admin_write on public.report_locations
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------- reports
drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports
  for select to authenticated
  using (
    status <> 'closed'
    or reporter_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists reports_insert_own on public.reports;
create policy reports_insert_own on public.reports
  for insert to authenticated
  with check (reporter_id = auth.uid() and status = 'open');

drop policy if exists reports_update_own on public.reports;
create policy reports_update_own on public.reports
  for update to authenticated
  using (reporter_id = auth.uid() or public.is_admin())
  with check (reporter_id = auth.uid() or public.is_admin());

drop policy if exists reports_delete_own on public.reports;
create policy reports_delete_own on public.reports
  for delete to authenticated
  using (reporter_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------- claims
drop policy if exists claims_read on public.claims;
create policy claims_read on public.claims
  for select to authenticated
  using (
    claimant_id = auth.uid()
    or public.owns_report(report_id)
    or public.is_admin()
  );

drop policy if exists claims_insert_own on public.claims;
create policy claims_insert_own on public.claims
  for insert to authenticated
  with check (
    claimant_id = auth.uid()
    and status = 'pending'
    and exists (
      select 1 from public.reports r
      where r.id = report_id
        and r.status in ('open', 'matched')
    )
  );

-- The person who posted the report reviews the claims on it: the finder
-- decides who the item really belongs to. Admins can override for disputes.
drop policy if exists claims_update_admin on public.claims;
drop policy if exists claims_update_reviewer on public.claims;
create policy claims_update_reviewer on public.claims
  for update to authenticated
  using (public.owns_report(report_id) or public.is_admin())
  with check (public.owns_report(report_id) or public.is_admin());

drop policy if exists claims_delete_own_pending on public.claims;
create policy claims_delete_own_pending on public.claims
  for delete to authenticated
  using (
    public.is_admin()
    or (claimant_id = auth.uid() and status = 'pending')
  );

-- ---------------------------------------------------------------- saved_reports
drop policy if exists saved_read_own on public.saved_reports;
create policy saved_read_own on public.saved_reports
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists saved_insert_own on public.saved_reports;
create policy saved_insert_own on public.saved_reports
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists saved_delete_own on public.saved_reports;
create policy saved_delete_own on public.saved_reports
  for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------- notifications
drop policy if exists notifications_read_own on public.notifications;
create policy notifications_read_own on public.notifications
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists notifications_delete_own on public.notifications;
create policy notifications_delete_own on public.notifications
  for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists notifications_admin_insert on public.notifications;
create policy notifications_admin_insert on public.notifications
  for insert to authenticated
  with check (public.is_admin());
