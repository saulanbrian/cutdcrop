import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedAlert } from "@/src/components/ui";
import { deleteQuiz } from "@/src/api/services/quiz";
import useQueryUpdater from "@/src/api/hooks/use-query-updater";
import { Quiz } from "@/src/api/types/quiz";
import { Summary } from "@/src/api/types/summary";
import { useQuiz } from "@/src/context/quiz/QuizContext";

export const DeleteButton = () => {

  const { colors } = useUnistyles().theme
  const { id, ref: summaryId } = useQuiz()
  const [alertVisible, setAlertVisible] = useState(false)
  const { removeDataFromInfiniteQuery, updateDataFromInfiniteQuery } = useQueryUpdater<Quiz | Summary>()

  const {
    mutate,
    isPending
  } = useMutation({
    mutationFn: async () => {
      const { data, error } = await deleteQuiz(id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      setAlertVisible(false)
      removeDataFromInfiniteQuery({ id, queryKey: ["quizzes"] })
      updateDataFromInfiniteQuery({
        id: summaryId,
        queryKey: ["summaries"],
        updateFields: {
          quizId: null
        }
      })
    }
  })

  return (
    <TouchableOpacity onPress={() => {
      setAlertVisible(true)
    }}>
      <FontAwesome
        name={"trash-o"}
        size={16}
        color={colors.error}
      />
      <ThemedAlert
        title={"Confirm deletion"}
        text={"Are you sure you want to delete this quiz?"}
        primaryAction={{
          title: "delete",
          warning: true,
          onDispatch: mutate,
          isPending: isPending
        }}
        secondaryAction={{
          title: "cancel",
          onDispatch: () => {
            if (!isPending) {
              setAlertVisible(false)
            }
          }
        }}
        visible={alertVisible}
      />
    </TouchableOpacity>
  )
}
