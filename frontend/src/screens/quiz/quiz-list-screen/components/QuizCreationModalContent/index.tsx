import { Summary } from "@/src/api/types/summary";
import {
  ThemedText,
  ThemedView,
  TransparentModalView,
  TransparentModalViewRef,
} from "@/src/components/ui";
import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import GenerateQuizButton from "./GenerateQuizButton";
import SummaryInputButton from "./SummaryInputButton";
import SummaryPicker from "./SummaryPicker";
import { MODAL_WIDTH } from "./constants";

const SUMMARY_CREATION_NOTES = [
  "only 1 quiz can be generated for each summary",
  'summary status must be success / "ready to view" ',
];

function QuizCreationModalContent({
  toggle: toggleSelf,
}: {
  toggle: () => void;
}) {
  const [selectedSummary, setSelectedSummary] = useState<Summary>();
  const modalRef = useRef<TransparentModalViewRef>(null);

  const handleSummaryPick = useCallback(
    (summary: Summary) => {
      setSelectedSummary(summary);
      modalRef.current?.toggle();
    },
    [],
  );

  return (
    <ThemedView style={styles.quizGenerationContainer}>
      <SummaryInputButton
        selectedSummary={selectedSummary}
        onRemoveSummary={() => setSelectedSummary(undefined)}
        onPress={() => modalRef.current?.toggle()}
      />
      <GenerateQuizButton
        summaryId={selectedSummary?.id}
        onSettled={toggleSelf}
      />
      <View>
        <ThemedText size={"xs"} color={"secondary"}>
          Note:
        </ThemedText>
        {SUMMARY_CREATION_NOTES.map((note, i) => (
          <ThemedText size={"xs"} color={"secondary"} key={i.toString()}>
            {`${i + 1}. ${note}`}
          </ThemedText>
        ))}
      </View>
      <TransparentModalView ref={modalRef}>
        <SummaryPicker onPickSummary={handleSummaryPick} />
      </TransparentModalView>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  quizGenerationContainer: {
    width: MODAL_WIDTH,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
  },
}));

export default QuizCreationModalContent;
