import { useGetInfiniteQuiz } from "@/src/api/queries/quiz";
import { mapInfiniteDataResult } from "@/src/api/utils/map-infinite-data-result";
import { EmptyQueryScreen } from "@/src/components/ui";
import { QuizStackParamList } from "@/src/navigation/quiz/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import QuizCard from "./QuizCard";

function QuizList() {

  const {
    data,
    refetch,
    isRefetching
  } = useGetInfiniteQuiz()

  const { params } = useRoute<RouteProp<QuizStackParamList, 'QuizList'>>()
  const [selectedQuiz, setSelectedQuiz] = useState<string | undefined>()
  const [height, setHeight] = useState(0)

  const quizzes = useMemo(() => {
    return mapInfiniteDataResult(data)
  }, [data])

  useEffect(() => {
    setSelectedQuiz(params?.select)
  }, [params])

  return (
    <FlashList
      data={quizzes}
      extraData={selectedQuiz}
      keyExtractor={item => item.id}
      onRefresh={refetch}
      refreshing={isRefetching}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <QuizCard
          onPress={() => { setSelectedQuiz(item.id) }}
          selected={selectedQuiz === item.id}
          {...item}
        />
      )}
      estimatedItemSize={80}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContent}
      onLayout={e => setHeight(e.nativeEvent.layout.height)}
      ListEmptyComponent={<EmptyComponent height={height} />}
    />
  )
}

const EmptyComponent = ({ height }: { height: number }) => {
  return (
    <EmptyQueryScreen
      queryName={"quiz"}
      style={{ height }}
    >
      <EmptyQueryScreen.Message />
    </EmptyQueryScreen>
  )
}

const styles = StyleSheet.create(theme => ({
  listContent: {
    paddingVertical: 8
  },
  separator: {
    height: 4,
    opacity: 0
  }
}))

export default QuizList
