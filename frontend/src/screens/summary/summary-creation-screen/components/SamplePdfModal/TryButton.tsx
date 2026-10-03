import { ActionButton, TransparentModalViewRef } from "@/src/components/ui";
import useQueryUpdater from "@/src/api/hooks/use-query-updater";
import { getUserIdAsync } from "@/src/api/services/auth";
import { requestSummary } from "@/src/api/server/summary";
import { Summary } from "@/src/api/types/summary";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { RefObject, useCallback } from "react";
import { supabase } from "@/supabase/client";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native-unistyles";

type TryButtonProps = {
  modalRef: RefObject<TransparentModalViewRef | null>;
}

const TryButton = ({ modalRef }: TryButtonProps) => {

  const { insertIntoInfiniteQuery, updateDataFromInfiniteQuery } = useQueryUpdater<Summary>()
  const navigation = useNavigation()

  const { status, mutate } = useMutation<Summary>({
    mutationFn: async () => {
      const userId = await getUserIdAsync({ throwOnError: true })
      const { data, error } = await supabase
        .from("summaries")
        .insert({
          owner: userId!,
          document_url: "sample.pdf",
          title: "sample pdf",
        })
        .select("*,quizzes(id)")
        .single()
      if (error || !data) throw error
      return {
        ...data,
        quizId: data.quizzes?.id ?? null
      }
    },
    onSuccess: summary => {
      insertIntoInfiniteQuery({
        newData: summary,
        queryKey: ["summaries"]
      })
      requestForSummary(summary.id)
      modalRef.current?.toggle()
      navigation.goBack()
    },
    onError: e => {
      Toast.show({
        type: "error",
        text1: "couldn't create summary",
        text2: e.message,
      })
    }
  })

  const requestForSummary = useCallback(async (id: string) => {
    const data = await requestSummary(id)
    if (!data) {
      updateDataFromInfiniteQuery({
        id,
        queryKey: ["summaries"],
        updateFields: {
          status: "error"
        }
      })
    }
  }, [updateDataFromInfiniteQuery])

  return <ActionButton
    onPress={() => mutate()}
    title={"Try Now"}
    status={status}
    style={styles.tryButton}
  />
}

const styles = StyleSheet.create(theme => ({
  tryButton: {
    borderRadius: theme.radii.pill
  }
}))

export default TryButton
