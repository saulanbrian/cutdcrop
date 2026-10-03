import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { getSummaries, getSummary } from "@/src/api/services/summary"
import { Summary } from "@/src/api/types/summary"
import { PageResult } from "@/src/api/types/page-result"

export const useGetSummaries = () => {
  return useSuspenseInfiniteQuery<PageResult<Summary>>({
    queryKey: ["summaries"],
    queryFn: async ({ pageParam }) => {
      const data = await getSummaries({
        page: pageParam as number
      })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _) => lastPage.next
  })
}


export const useGetSummary = (id: string) => {
  return useSuspenseQuery<Summary>({
    queryKey: ["summary", id],
    queryFn: async () => {
      const { data, error } = await getSummary(id)
      if (error) throw error
      return {
        ...data,
        quizId: data.quizzes?.id ?? null
      }
    },
  })
}
