import { submitResponse } from "@/src/api/services/quiz";
import { useMutation } from "@tanstack/react-query";

type SubmitQuizResponseArgs = {
  quizId: string;
  optionIds: string[];
  score: number;
};

export function useSubmitQuizResponse() {
  return useMutation({
    mutationFn: async ({ quizId, optionIds, score }: SubmitQuizResponseArgs) => {
      const { data, error } = await submitResponse({
        quizId,
        optionIds,
        score,
      });
      if (error) throw error;
      return data;
    },
  });
}
