import { QuestionWithOptions } from "@/src/api/types/quiz";
import { useCallback, useMemo, useState } from "react";
import { scoreAnswers } from "@/src/screens/quiz/quiz-play-screen/utils";

export type AnsweredQuestion = {
  questionId: string;
  optionId: string;
};

export function useQuizTracking(questions: QuestionWithOptions[]) {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);

  const question = questions[current];

  const answers = useMemo<AnsweredQuestion[]>(
    () =>
      Object.entries(picks).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      })),
    [picks],
  );

  const optionIds = useMemo(() => answers.map((a) => a.optionId), [answers]);

  const score = useMemo(
    () => scoreAnswers(questions, optionIds),
    [questions, optionIds],
  );

  const isFinished = questions.length > 0 && answers.length >= questions.length;

  const pick = useCallback(
    (optionId: string) => {
      const q = questions[current];
      if (!q) return;
      setPicks((prev) => ({ ...prev, [q.id]: optionId }));
      setCurrent((c) => Math.min(c + 1, questions.length));
    },
    [current, questions],
  );

  const reset = useCallback(() => {
    setPicks({});
    setCurrent(0);
  }, []);

  return {
    question,
    totalQuestions: questions.length,
    optionIds,
    score,
    isFinished,
    pick,
    reset,
  };
}
