-- Normalized quiz content: questions + options replace the quizzes.content JSONB blob.
-- answers records the user's picks (replace-on-submit, latest only).
-- quizzes.content is kept for now; it will be dropped in a later migration
-- after the frontend is cut over to these tables.

create type public.question_type as enum (
  'multiple_choice', 'true_or_false'
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  text text not null,
  type public.question_type not null,
  position int not null,
  constraint uq_questions_quiz_position unique (quiz_id, position)
);

create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  value text not null,
  is_correct boolean not null default false
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  option_id uuid not null references public.options(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  answered_at timestamptz not null default now()
);

create index if not exists idx_questions_quiz_position
  on public.questions (quiz_id, position);

create index if not exists idx_options_question
  on public.options (question_id);

create index if not exists idx_answers_quiz
  on public.answers (quiz_id);

-- Row level security: quiz content is visible to / writable by the quiz owner
-- (quizzes.ref -> summaries.owner). answers additionally carry user_id.

alter table public.questions enable row level security;
alter table public.options enable row level security;
alter table public.answers enable row level security;

create policy "quiz owner full access to questions"
  on public.questions for all
  using (
    exists (
      select 1 from public.quizzes q
      join public.summaries s on s.id = q.ref
      where q.id = questions.quiz_id
        and s.owner = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.quizzes q
      join public.summaries s on s.id = q.ref
      where q.id = questions.quiz_id
        and s.owner = auth.uid()
    )
  );

create policy "quiz owner full access to options"
  on public.options for all
  using (
    exists (
      select 1 from public.questions qu
      join public.quizzes q on q.id = qu.quiz_id
      join public.summaries s on s.id = q.ref
      where qu.id = options.question_id
        and s.owner = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.questions qu
      join public.quizzes q on q.id = qu.quiz_id
      join public.summaries s on s.id = q.ref
      where qu.id = options.question_id
        and s.owner = auth.uid()
    )
  );

create policy "quiz owner full access to answers"
  on public.answers for all
  using (
    answers.user_id = auth.uid()
    and exists (
      select 1 from public.quizzes q
      join public.summaries s on s.id = q.ref
      where q.id = answers.quiz_id
        and s.owner = auth.uid()
    )
  )
  with check (
    answers.user_id = auth.uid()
    and exists (
      select 1 from public.quizzes q
      join public.summaries s on s.id = q.ref
      where q.id = answers.quiz_id
        and s.owner = auth.uid()
    )
  );

-- Backfill: migrate existing quizzes.content JSONB
-- ({ questions: [{ question, type, choices: [{ text | value, is_correct }] }] })
-- into questions + options rows. True/false boolean values become 'true'/'false' text,
-- matching the frontend label logic.

do $$
declare
  q record;
  qq jsonb;
  cc jsonb;
  qid uuid;
  pos int;
  label text;
  arr jsonb;
begin
  for q in
    select id, content from public.quizzes where content is not null
  loop
    arr := q.content -> 'questions';
    if jsonb_typeof(arr) <> 'array' then
      continue;
    end if;
    pos := 0;
    for qq in
      select * from jsonb_array_elements(arr)
    loop
      qid := gen_random_uuid();
      insert into public.questions (id, quiz_id, text, type, position)
      values (
        qid,
        q.id,
        qq ->> 'question',
        (qq ->> 'type')::public.question_type,
        pos
      );
      for cc in
        select * from jsonb_array_elements(qq -> 'choices')
      loop
        label := coalesce(cc ->> 'text', cc ->> 'value');
        insert into public.options (question_id, value, is_correct)
        values (
          qid,
          label,
          coalesce((cc ->> 'is_correct')::boolean, false)
        );
      end loop;
      pos := pos + 1;
    end loop;
  end loop;
end $$;
