-- Attempt history: one responses row per quiz attempt, answers become its
-- line items. Latest attempt per quiz/user is ORDER BY submitted_at DESC LIMIT 1.
-- The answers table was never written by the app, so no backfill is needed.

-- 0. Drop the old answers policy FIRST — it depends on answers.quiz_id,
--    which the restructure below removes. (Postgres refuses to drop a
--    column that a policy still references.)

drop policy if exists "quiz owner full access to answers"
  on public.answers;

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score int not null default 0,
  submitted_at timestamptz not null default now()
);

-- answers: pure line items. quiz_id / user_id are derivable through the
-- response, so they are dropped in favor of the single response_id link.

alter table public.answers
  add column response_id uuid references public.responses(id) on delete cascade;

alter table public.answers
  drop column quiz_id,
  drop column user_id;

alter table public.answers
  add constraint uq_answers_response_option unique (response_id, option_id);

create index if not exists idx_responses_quiz_submitted
  on public.responses (quiz_id, submitted_at desc);

create index if not exists idx_answers_response
  on public.answers (response_id);

drop index if exists idx_answers_quiz;

-- Row level security: attempts are visible to / writable by the quiz owner
-- (responses.quiz_id -> quizzes.ref -> summaries.owner). answers are checked
-- through the answers -> responses -> quizzes -> summaries chain.

alter table public.responses enable row level security;

create policy "quiz owner full access to responses"
  on public.responses for all
  using (
    responses.user_id = auth.uid()
    and exists (
      select 1 from public.quizzes q
      join public.summaries s on s.id = q.ref
      where q.id = responses.quiz_id
        and s.owner = auth.uid()
    )
  )
  with check (
    responses.user_id = auth.uid()
    and exists (
      select 1 from public.quizzes q
      join public.summaries s on s.id = q.ref
      where q.id = responses.quiz_id
        and s.owner = auth.uid()
    )
  );

create policy "quiz owner full access to answers"
  on public.answers for all
  using (
    exists (
      select 1 from public.responses r
      join public.quizzes q on q.id = r.quiz_id
      join public.summaries s on s.id = q.ref
      where r.id = answers.response_id
        and r.user_id = auth.uid()
        and s.owner = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.responses r
      join public.quizzes q on q.id = r.quiz_id
      join public.summaries s on s.id = q.ref
      where r.id = answers.response_id
        and r.user_id = auth.uid()
        and s.owner = auth.uid()
    )
  );
