import { Summary } from "@/src/api/types/summary";
import { useGetSummaries } from "@/src/api/queries/summary";
import { mapInfiniteDataResult } from "@/src/api/utils/map-infinite-data-result";
import { LoadingScreen, ThemedText, ThemedView } from "@/src/components/ui";
import SummaryCardBase from "@/src/components/summary/SummaryCard/SummaryCardBase";
import SummaryList from "@/src/components/summary/SummaryList";
import SummaryContextProvider from "@/src/context/summary/SummaryContext";
import { S } from "@/src/constants/styles";
import { Suspense, useMemo } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { MODAL_HEIGHT, MODAL_WIDTH } from "./constants";

function SummaryPicker({
  onPickSummary,
}: {
  onPickSummary: (summary: Summary) => void;
}) {
  return (
    <ThemedView style={styles.summaryListModalContainer}>
      <Suspense fallback={<LoadingScreen />}>
        <SummaryList
          estimatedItemSize={222}
          decelerationRate="normal"
          contentContainerStyle={undefined}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <ThemedView style={[S.centerContainer, styles.listEmptyComponent]}>
              <ThemedText color={"secondary"} style={styles.listEmptyText}>
                {"You don't have a summary. create one to generate a quiz"}
              </ThemedText>
            </ThemedView>
          }
          ListFooterComponent={SummaryListFooter}
          renderItem={({ item }) => (
            <SummaryContextProvider {...item}>
              <Pressable
                style={
                  item.quizId || item.status !== "success"
                    ? styles.summaryPickableDisabled
                    : styles.summaryPickable
                }
                disabled={!!item.quizId || item.status !== "success"}
                onPress={() => onPickSummary(item)}
              >
                <SummaryCardBase />
              </Pressable>
            </SummaryContextProvider>
          )}
        />
      </Suspense>
    </ThemedView>
  );
}

const SummaryListFooter = () => {
  const { data } = useGetSummaries();

  const summaries = useMemo(() => {
    return mapInfiniteDataResult(data);
  }, [data]);

  if (summaries.length < 1) return null;

  return (
    <ThemedText size={"sm"} color={"tertiary"} style={styles.endMessage}>
      No more summaries
    </ThemedText>
  );
};

const styles = StyleSheet.create((theme) => ({
  summaryPickable: {
    opacity: 1,
  },
  summaryPickableDisabled: {
    opacity: 0.5,
  },
  listEmptyText: {
    textAlign: "center",
  },
  endMessage: {
    alignSelf: "center",
    padding: theme.spacing.sm,
  },
  listEmptyComponent: {
    height: MODAL_HEIGHT * 0.8,
    width: MODAL_WIDTH / 1.5,
    alignSelf: "center",
  },
  separator: {
    height: 2,
  },
  summaryListModalContainer: {
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
}));

export default SummaryPicker;
