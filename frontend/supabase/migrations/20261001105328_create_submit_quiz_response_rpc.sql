-- Atomic quiz submit: creates one responses row plus all its answers lines
-- in a single transaction (all-or-nothing — no orphan responses possible).
-- Runs as the caller (security invoker), so the existing owner-scoped RLS
-- policies apply to every row it touches. user_id is taken from auth.uid(),
-- never from client input.

create or replace function public.submit_quiz_response(
  p_quiz_id uuid,
  p_option_ids uuid[],
  p_score int
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_user_id uuid := auth.uid();
  v_response_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.responses (quiz_id, user_id, score)
  values (p_quiz_id, v_user_id, p_score)
  returning id into v_response_id;

  insert into public.answers (response_id, option_id)
  select v_response_id, unnest(p_option_ids)
  on conflict (response_id, option_id) do nothing;

  return v_response_id;
end;
$$;

grant execute on function public.submit_quiz_response(uuid, uuid[], int)
  to authenticated;
