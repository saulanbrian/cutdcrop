import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Summary } from "@/src/api/types/summary";
import SummaryCardBase from "@/src/components/summary/SummaryCard/SummaryCardBase";
import { ThemedText, ThemedView } from "@/src/components/ui";
import SummaryContextProvider from "@/src/context/summary/SummaryContext";

type SummaryInputButtonProps = {
  onPress: () => void;
  onRemoveSummary: () => void;
  selectedSummary?: Summary;
};

function SummaryInputButton({
  selectedSummary,
  onRemoveSummary,
  onPress,
}: SummaryInputButtonProps) {
  if (selectedSummary) {
    return (
      <TouchableOpacity onPress={onRemoveSummary}>
        <SummaryContextProvider {...selectedSummary}>
          <SummaryCardBase />
        </SummaryContextProvider>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={styles.summaryInputButton} surface>
        <ThemedText fw={"bold"} size={"lg"} color={"secondary"}>
          Pick a Summary
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  summaryInputButton: {
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default SummaryInputButton;
