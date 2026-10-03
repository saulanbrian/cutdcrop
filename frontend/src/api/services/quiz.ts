import { supabase } from "@/supabase/client";
import { Quiz, QuizListItem } from "@/src/api/types/quiz";
import { PageResult } from "@/src/api/types/page-result";
import { getUserIdAsync } from "./auth";

const pageLimit = 10;

export async function getQuizzes({
  page,
}: {
  page: number;
}): Promise<PageResult<QuizListItem>> {
  const userId = await getUserIdAsync({ throwOnError: true });
  if (!userId) throw new Error("No user logged in");

  const from_ = (page - 1) * pageLimit;
  const to_ = page + pageLimit;

  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select(
      `*, summaries!inner(owner,title), questions(count), responses(score, submitted_at)`,
    )
    .filter("summaries.owner", "eq", userId)
    .range(from_, to_);

  if (error) throw error;

  const hasNextPage = quizzes.length > pageLimit;

  return {
    results: quizzes.map(({ summaries, questions, responses, ...q }) => ({
      ...q,
      summaryTitle: summaries.title,
      questionCount: questions?.[0]?.count ?? 0,
      // score = latest attempt's score; null when never attempted.
      score: latestResponseScore(responses ?? []),
    })),
    next: hasNextPage ? page + 1 : undefined,
  };
}

function latestResponseScore(
  responses: { score: number; submitted_at: string }[],
): number | null {
  if (responses.length === 0) return null;
  return responses.reduce((a, b) => (a.submitted_at >= b.submitted_at ? a : b))
    .score;
}

export async function getQuiz(id: string) {
  return supabase
    .from("quizzes")
    .select(
      "*,summaries(title),questions(id,quiz_id,text,type,position,options(id,question_id,value,is_correct))",
    )
    .eq("id", id)
    .order("position", { foreignTable: "questions" })
    .single();
}

export async function getLatestResponse(quizId: string) {
  const userId = await getUserIdAsync({ throwOnError: true });
  if (!userId) throw new Error("No user logged in");

  return supabase
    .from("responses")
    .select("id, quiz_id, user_id, score, submitted_at, answers(id, option_id)")
    .eq("quiz_id", quizId)
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function submitResponse({
  quizId,
  optionIds,
  score,
}: {
  quizId: string;
  optionIds: string[];
  score: number;
}) {
  return supabase.rpc("submit_quiz_response", {
    p_quiz_id: quizId,
    p_option_ids: optionIds,
    p_score: score,
  });
}

export async function getQuizBySummaryId(summaryId: string) {
  return await supabase
    .from("quizzes")
    .select("*,summaries(title)")
    .eq("ref", summaryId)
    .single();
}

export async function createQuiz(summaryId: string) {
  return await supabase
    .from("quizzes")
    .insert({
      ref: summaryId,
    })
    .select("*,summaries(title)")
    .single();
}

export async function updateQuiz({
  id,
  updateFields,
}: {
  id: string;
  updateFields: Partial<Omit<Quiz, "id">>;
}) {
  return await supabase
    .from("quizzes")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();
}

export async function deleteQuiz(id: string) {
  return await supabase.from("quizzes").delete().eq("id", id);
}

export async function markQuizError(id: string) {
  return await supabase
    .from("quizzes")
    .update({ status: "error" })
    .eq("id", id);
}
