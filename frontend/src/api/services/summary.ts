import { supabase } from "@/supabase/client";
import { Summary } from "@/src/api/types/summary";
import { getUserIdAsync } from "./auth";
import { PageResult } from "@/src/api/types/page-result";

const pageLimit = 10

export async function getSummaries({
  page,
}: {
  page: number
}): Promise<PageResult<Summary>> {
  const userId = await getUserIdAsync({ throwOnError: true })
  if (!userId) throw new Error("No user logged in")

  const from_ = (page - 1) * pageLimit
  const to_ = page * pageLimit

  const { data, error } = await supabase
    .from("summaries")
    .select("*, quizzes(id)")
    .filter("owner", "eq", userId)
    .order("created_at", { ascending: false })
    .range(from_, to_)

  if (error) {
    throw error
  }

  const hasNextPage = data.length > pageLimit;

  const summaries = hasNextPage ? data.slice(0, pageLimit) : data

  return {
    results: summaries.map(summary => ({
      ...summary,
      quizId: summary.quizzes?.id ?? null
    })),
    next: hasNextPage ? page + 1 : undefined,
  }
}

export async function getSummary(id: string) {
  return await supabase
    .from("summaries")
    .select("*, quizzes(id)")
    .eq("id", id)
    .single()
}

export type InsertSummaryFields = Pick<Summary, 'description' | 'title'> & {
  document_url: string;
  cover_url: string | null;
}

export async function insertSummary(fields: InsertSummaryFields) {

  const userId = await getUserIdAsync({ throwOnError: true })

  const { data: summary, error: summaryError } = await supabase
    .from("summaries")
    .insert({
      owner: userId!,
      ...fields
    })
    .select()
    .single()

  if (summaryError || !summary) {
    throw summaryError || new Error("an error has occured")
  }

  return summary

}

export async function updateSummary({
  id,
  fields
}: {
  id: string;
  fields: Partial<Summary>
}) {
  return await supabase
    .from("summaries")
    .update(fields)
    .eq("id", id)
    .select()
    .single()
}

export async function deleteSummary(id: string) {
  return await supabase.from("summaries")
    .delete()
    .eq("id", id)
}

export async function markSummaryError(id: string) {
  return await supabase
    .from("summaries")
    .update({ status: "error" })
    .eq("id", id)
}
