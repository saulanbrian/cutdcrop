import { getUserIdAsync } from "@/src/api/services/auth";
import { ThemedText, TransparentModalViewRef } from "@/src/components/ui";
import { supabase } from "@/supabase/client";
import { RefObject, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type SamplePdfModalButtonProps = {
  modalRef: RefObject<TransparentModalViewRef | null>;
}

function SamplePdfModalButton({ modalRef }: SamplePdfModalButtonProps) {

  const [isLoading, setIsLoading] = useState(true)
  const [hasSummary, setHasSummary] = useState<boolean>()

  useEffect(() => {
    (async () => {
      try {
        const userId = await getUserIdAsync({
          throwOnError: true
        })
        const { count, error } = await supabase
          .from("summaries")
          .select("id", { count: "exact", head: true })
          .eq("owner", userId!)
        if (error) throw error
        setHasSummary((count ?? 0) > 0)
      } catch {
        setHasSummary(false)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading || hasSummary) return null

  return (
    <TouchableOpacity
      onPress={() => modalRef.current?.toggle()}
    >
      <ThemedText
        size={"sm"}
        color={"themePrimary"}
        style={styles.samplePdfModalButtonText}
      >
        don&apos;t have a pdf? try a sample
      </ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(theme => ({
  samplePdfModalButtonText: {
    marginVertical: theme.spacing.md
  },
}))

export default SamplePdfModalButton
