import {
  QuestionType,
  QuestionWithOptions,
  ResponseWithAnswers,
} from "@/src/api/types/quiz";
import { ThemedText } from "@/src/components/ui";
import { View } from "react-native";
import Option from "./Option";
import OptionBase from "./OptionBase";

type QuizFormProps =
  | {
      mode: "answer";
      question: QuestionWithOptions | undefined;
      onPick: (optionId: string) => void;
    }
  | {
      mode: "review";
      questions: QuestionWithOptions[];
      response: ResponseWithAnswers;
    };

function QuizForm(props: QuizFormProps) {
  const isReview = props.mode === "review";
  const onPick = props.mode === "answer" ? props.onPick : undefined;
  const pickedOptionIds = isReview
    ? new Set(props.response.answers.map((a) => a.option_id))
    : undefined;
  const questions = isReview
    ? props.questions
    : props.question
      ? [props.question]
      : [];

  return (
    <View>
      {questions.map((question) => {
        const trueOrFalse = question.type === QuestionType.TrueOrFalse;
        return (
          <View key={question.id}>
            <ThemedText>{question.text}</ThemedText>
            {question.options.map((o) => {
              const icon = trueOrFalse
                ? o.value === "true"
                  ? ("check" as const)
                  : ("cross" as const)
                : undefined;
              return onPick ? (
                <Option
                  key={o.id}
                  label={o.value}
                  icon={icon}
                  onPress={() => onPick(o.id)}
                />
              ) : (
                <OptionBase
                  key={o.id}
                  label={o.value}
                  icon={icon}
                  picked={pickedOptionIds?.has(o.id) ?? false}
                  correct={o.is_correct}
                  reveal={isReview}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

export default QuizForm;
