-- Siết advisor Supabase: Security Definer View, PUBLIC execute, RLS initplan.
-- Chạy từng phần trên SQL Editor nếu cần; tránh DO $$ vì Dashboard dễ cắt chuỗi.

-- 1) View tôn trọng RLS của bảng gốc (security_invoker)
drop view if exists public.submissions_with_priority;

create view public.submissions_with_priority
with (security_invoker = on) as
select
  *,
  (array_length(followed_channels, 1) = 4) as has_full_follow_priority
from public.submissions
where status = 'approved'
order by vote_count desc;

revoke all on public.submissions_with_priority from public;
grant select on public.submissions_with_priority to anon, authenticated, service_role;

-- 2) RLS profiles: cache auth.uid() theo statement
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 3) Không cho client gọi trực tiếp SECURITY DEFINER functions
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;

revoke all on function public.increment_vote_count() from public;
revoke all on function public.increment_vote_count() from anon, authenticated;

revoke all on function public.delete_expired_pending_submissions() from public;
revoke all on function public.delete_expired_pending_submissions() from anon, authenticated;
grant execute on function public.delete_expired_pending_submissions() to service_role;

-- 4) rls_auto_enable (nếu không tồn tại / sai chữ ký thì bỏ qua dòng này)
revoke all on function public.rls_auto_enable() from public;
revoke all on function public.rls_auto_enable() from anon, authenticated;
