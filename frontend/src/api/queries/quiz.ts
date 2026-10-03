import {
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { PageResult } from "@/src/api/types/page-result";
import { Quiz, QuizListItem, QuizWithQuestions, ResponseWithAnswers } from "@/src/api/types/quiz";
import { getLatestResponse, getQuizzes, getQuiz, getQuizBySummaryId } from "@/src/api/services/quiz";

export const useGetInfiniteQuiz = () => {
  return useSuspenseInfiniteQuery<PageResult<QuizListItem>>({
    queryKey: ["quizzes"],
    queryFn: async ({ pageParam: page }) => {
      const data = await getQuizzes({ page: page as number });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.next,
  });
};

export const useGetQuizBySummaryId = (summaryId: string) => {
  return useQuery<Quiz>({
    queryKey: ["summary", summaryId, "quiz"],
    queryFn: async () => {
      const { data, error } = await getQuizBySummaryId(summaryId);
      if (error) throw error;
      return {
        ...data,
        content: data.content as Quiz["content"],
        summaryTitle: data.summaries.title,
      };
    },
  });
};

export const useGetQuiz = (id: string) => {
  return useSuspenseQuery<QuizWithQuestions>({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const { data, error } = await getQuiz(id);
      if (error) throw error;
      const { content, summaries, ...quiz } = data;
      return {
        ...quiz,
        questions: data.questions,
        summaryTitle: summaries.title,
      };
    },
  });
};

export const useGetLatestResponse = (quizId: string) => {
  return useSuspenseQuery<ResponseWithAnswers | null>({
    queryKey: ["quiz", quizId, "latest-response"],
    queryFn: async () => {
      const { data, error } = await getLatestResponse(quizId);
      if (error) throw error;
      return data;
    },
  });
};
