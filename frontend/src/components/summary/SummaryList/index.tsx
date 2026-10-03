import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useGetSummaries } from "@/src/api/queries/summary";
import { Summary } from "@/src/api/types/summary";
import { mapInfiniteDataResult } from "@/src/api/utils/map-infinite-data-result";
import { EmptyQueryScreen } from "@/src/components/ui";
import SummaryCard from "@/src/components/summary/SummaryCard";

type SummaryListProps = Omit<
  FlashListProps<Summary>,
  "data" | "keyExtractor" | "renderItem"
> & {
  renderItem?: FlashListProps<Summary>["renderItem"];
};

function SummaryList({ renderItem, ...props }: SummaryListProps) {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useGetSummaries();

  const [height, setHeight] = useState(0);

  const summaries = useMemo(() => {
    return mapInfiniteDataResult(data);
  }, [data]);

  return (
    <FlashList
      data={summaries}
      keyExtractor={(item) => item.id}
      refreshing={isRefetching}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      onEndReached={() => hasNextPage && fetchNextPage()}
      estimatedItemSize={123}
      decelerationRate={0.5}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={renderItem ?? (({ item }) => <SummaryCard {...item} />)}
      contentContainerStyle={styles.summaryContainer}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      ListEmptyComponent={
        <EmptyQueryScreen queryName={"summary"} style={{ height }}>
          <EmptyQueryScreen.Message />
        </EmptyQueryScreen>
      }
      {...props}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  separator: {
    height: 6,
  },
  summaryContainer: {
    padding: theme.spacing.sm,
  },
}));

export default SummaryList;
