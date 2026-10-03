import { QuestionWithOptions } from "@/src/api/types/quiz";

export function scoreAnswers(
  questions: QuestionWithOptions[],
  optionIds: string[],
): number {
  const correctIds = new Set(
    questions.flatMap((q) =>
      q.options.filter((o) => o.is_correct).map((o) => o.id),
    ),
  );
  return optionIds.filter((optionId) => correctIds.has(optionId)).length;
}
