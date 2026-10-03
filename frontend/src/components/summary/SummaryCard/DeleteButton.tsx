import { useState } from "react";
import ModalActionButton from "./ModalActionButton";
import { Ionicons } from "@expo/vector-icons";
import { ThemedAlert, ThemedText } from "@/src/components/ui";
import { useUnistyles } from "react-native-unistyles";
import { deleteSummary } from "@/src/api/services/summary";
import { useSummary } from "@/src/context/summary/SummaryContext";
import useQueryUpdater from "@/src/api/hooks/use-query-updater";
import { useMutation } from "@tanstack/react-query";
import { Summary } from "@/src/api/types/summary";
import { Quiz } from "@/src/api/types/quiz";
import { supabase } from "@/supabase/client";


type DeleteButtonProps = {
  modalDismissFn: () => void;
}

function DeleteButton({ modalDismissFn }: DeleteButtonProps) {

  const [alertVisible, setAlertVisible] = useState(false)
  const { colors } = useUnistyles().theme
  const { id, quizId, cover_url, document_url } = useSummary()
  const { removeDataFromInfiniteQuery } = useQueryUpdater<Quiz | Summary>()

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await deleteSummary(id)
      return data
    },
    onSuccess: () => {
      removeDataFromInfiniteQuery({
        id,
        queryKey: ["summaries"]
      })
      if (quizId) {
        removeDataFromInfiniteQuery({
          id: quizId,
          queryKey: ["quizzes"]
        })
      }
      setAlertVisible(false)
      modalDismissFn()
      const urls = [document_url]
      if (cover_url) {
        urls.push(cover_url)
      }
      supabase.storage
        .from("summary_bucket")
        .remove(urls)
    }
  })


  return (
    <>
      <ModalActionButton
        onPress={() => setAlertVisible(true)}
        disabled={isPending}
      >
        <Ionicons
          name={"trash-bin"}
          size={24}
          color={colors.error}
        />
        <ThemedText
          size={"xxs"}
          color={"error"}
        >
          delete
        </ThemedText>
      </ModalActionButton>
      <ThemedAlert
        visible={alertVisible}
        title={"summary deletion confirmation"}
        text="are you sure you want to delete this summary?"
        primaryAction={{
          title: "delete",
          onDispatch: mutate,
          warning: true,
          isPending
        }}
        secondaryAction={{
          title: "cancel",
          onDispatch: () => {
            setAlertVisible(false)
          }
        }}
      />
    </>
  )
}

export default DeleteButton
