import useQueryUpdater from "@/src/api/hooks/use-query-updater";
import { createQuiz } from "@/src/api/services/quiz";
import { processQuiz } from "@/src/api/server/quiz";
import { QuizListItem } from "@/src/api/types/quiz";
import { ActionButton, ActionButtonProps } from "@/src/components/ui";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";


type GenerateQuizButtonProps = Omit<ActionButtonProps, 'disabled' | 'title' | 'status'> & {
  summaryId?: string,
  onSettled: () => void;
}

function GenerateQuizButton({
  summaryId,
  onSettled,
  ...props
}: GenerateQuizButtonProps) {

  const { insertIntoInfiniteQuery } = useQueryUpdater<QuizListItem>()

  const { status, mutate } = useMutation<QuizListItem>({
    mutationFn: async () => {
      if (summaryId) {
        const { data, error } = await createQuiz(summaryId)
        if (error) throw error
        const { content, summaries, ...quiz } = data
        return {
          ...quiz,
          summaryTitle: summaries.title,
          // freshly created quizzes have no questions yet —
          // the backend generates them async via processQuiz
          questionCount: 0,
          // and no attempts yet
          score: null
        }
      } else {
        throw new Error("No selected Summary")
      }
    },
    onError: e => {
      Toast.show({
        type: "error",
        text1: "couldn't generate quiz",
        text2: e.message,
      })
    },
    onSuccess: (quiz) => {
      processQuiz(quiz.id)
      insertIntoInfiniteQuery({ newData: quiz, queryKey: ["quizzes"] })
    },
    onSettled
  })

  return <ActionButton
    title={"Generate Quiz"}
    onPress={() => mutate()}
    status={status}
    disabled={!summaryId}
    {...props}
  />
}

export default GenerateQuizButton
