import { Database } from "@/supabase/types/supabase.data.types";

export enum QuestionType {
  TrueOrFalse = "true_or_false",
  MultipleChoice = "multiple_choice",
}

export type QuestionOption = {
  value: string;
  is_correct: boolean;
};

export type Question = {
  question: string;
  type: QuestionType;
  choices: QuestionOption[];
};

type Q = Database["public"]["Tables"]["quizzes"]["Row"];

export type Quiz = Omit<Q, "content"> & {
  content: {
    questions: Question[];
  } | null;
  summaryTitle: string;
};

export type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];

export type OptionRow = Database["public"]["Tables"]["options"]["Row"];

export type AnswerRow = Database["public"]["Tables"]["answers"]["Row"];

export type ResponseRow = Database["public"]["Tables"]["responses"]["Row"];

export type ResponseWithAnswers = ResponseRow & {
  answers: Pick<AnswerRow, "id" | "option_id">[];
};

export type QuestionWithOptions = QuestionRow & {
  options: OptionRow[];
};

export type QuizWithQuestions = Omit<Q, "content"> & {
  questions: QuestionWithOptions[];
  summaryTitle: string;
};

// List shape: the card shows score + question count only, so the query embeds
// a count aggregate instead of full question rows, and the score is derived
// from the latest responses row (quizzes.score was dropped). No `content` key —
// the list contract must not pretend the JSONB blob exists.

export type QuizListItem = Omit<Q, "content"> & {
  summaryTitle: string;
  questionCount: number;
  score: number | null;
};
