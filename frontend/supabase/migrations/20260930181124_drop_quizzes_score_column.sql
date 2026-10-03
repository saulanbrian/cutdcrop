-- quizzes.score is superseded by responses.score (one score per attempt).
-- Past scores exist nowhere else and are accepted as lost: no backfill.
-- The list card now derives its score from the latest responses row.

alter table public.quizzes drop column score;
