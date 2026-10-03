import { useGetLatestResponse, useGetQuiz } from "@/src/api/queries/quiz";
import { LoadingScreen, ThemedScreen, ThemedText } from "@/src/components/ui";
import QuizForm from "@/src/components/quiz/QuizForm";
import { S } from "@/src/constants/styles";
import { QuizStackParamList } from "@/src/navigation/quiz/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Suspense } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";


type QuizResultRouteProp = RouteProp<QuizStackParamList, 'QuizResult'>

function QuizResultScreen() {

  const { params: { id } } = useRoute<QuizResultRouteProp>()

  return (
    <ThemedScreen style={styles.screen}>
      <Suspense fallback={<LoadingScreen />}>
        <Content id={id} />
      </Suspense>
    </ThemedScreen>
  )
}

const Content = ({ id }: { id: string }) => {

  const { data: quiz } = useGetQuiz(id)
  const { data: response } = useGetLatestResponse(id)

  if (!response) return <NotFound />

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <QuizForm
        questions={quiz.questions}
        response={response}
        mode="review"
      />
    </ScrollView>
  )
}

const NotFound = () => {

  return (
    <View style={S.centerContainer}>
      <ThemedText
        size={"xl"}
        fw={"semiBold"}
        style={styles.text}
      >
        No attempts yet
      </ThemedText>
      <ThemedText
        color={"secondary"}
        style={styles.textSecondary}
      >
        finish the quiz first to see your review
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  screen: {
  },
  text: {
    color: theme.colors.textPrimary
  },
  textSecondary: {
    color: theme.colors.textSecondary
  }
}))

export default QuizResultScreen
