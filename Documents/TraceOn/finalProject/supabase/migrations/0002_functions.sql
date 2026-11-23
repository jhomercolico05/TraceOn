-- 0002_functions.sql
-- Triggers + helpers: profile auto-create, CvSU domain gate, is_admin(), updated_at.

-- ---------------------------------------------------------------- updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists reports_touch_updated_at on public.reports;
create trigger reports_touch_updated_at
  before update on public.reports
  for each row execute function public.touch_updated_at();

drop trigger if exists claims_touch_updated_at on public.claims;
create trigger claims_touch_updated_at
  before update on public.claims
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- is_admin()
-- SECURITY DEFINER so RLS policies on profiles do not recurse into themselves.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------- new user gate
-- Runs as the table owner, so the insert below bypasses RLS on profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null or lower(new.email) not like '%@cvsu.edu.ph' then
    raise exception 'TraceOn is limited to @cvsu.edu.ph accounts'
      using errcode = 'check_violation';
  end if;

  insert into public.profiles (id, full_name, email, student_no, program)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''),
             split_part(new.email, '@', 1)),
    new.email,
    nullif(new.raw_user_meta_data ->> 'student_no', ''),
    nullif(new.raw_user_meta_data ->> 'program', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- no self-claims
create or replace function public.prevent_self_claim()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.reports
    where id = new.report_id
      and reporter_id = new.claimant_id
  ) then
    raise exception 'You cannot claim an item from your own report'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists claims_prevent_self on public.claims;
create trigger claims_prevent_self
  before insert on public.claims
  for each row execute function public.prevent_self_claim();
