import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QuizStackParamList } from "./types";
import QuizListScreen from "@/src/screens/quiz/quiz-list-screen";
import useQueryUpdater from "@/src/api/hooks/use-query-updater";
import { Quiz } from "@/src/api/types/quiz";
import { supabase } from "@/supabase/client";
import { useEffect } from "react";
import QuizPlayScreen from "@/src/screens/quiz/quiz-play-screen";
import QuizSoundContextProvider from "@/src/context/quiz/QuizSoundProvider";
import QuizResultScreen from "@/src/screens/quiz/quiz-result-screen";

const Stack = createNativeStackNavigator<QuizStackParamList>()

export default function QuizStackNavigator() {

  const {
    updateDataFromInfiniteQuery,
    removeDataFromInfiniteQuery
  } = useQueryUpdater<Quiz>()

  useEffect(() => {
    const channel = supabase
      .channel("quizzes:all")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quizzes"
        },
        ({ eventType, new: newQuiz, old: oldQuiz }) => {
          switch (eventType) {

            case "UPDATE":
              updateDataFromInfiniteQuery({
                id: newQuiz.id,
                updateFields: newQuiz as Quiz,
                queryKey: ["quizzes"]
              })
              break

            case "DELETE":
              removeDataFromInfiniteQuery({
                queryKey: ["quizzes"],
                id: oldQuiz.id
              })
              break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- realtime channel is intentionally bound once; the updater helpers only close over the stable queryClient, so adding them would churn subscriptions every render for no benefit
  }, [])

  return (
    <QuizSoundContextProvider>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        animation: "ios_from_right"
      }}>
        <Stack.Screen
          name={"QuizList"}
          component={QuizListScreen}
        />
        <Stack.Screen
          name={"QuizPlayScreen"}
          component={QuizPlayScreen}
        />
        <Stack.Screen
          name={"QuizResult"}
          component={QuizResultScreen}
        />
      </Stack.Navigator>
    </QuizSoundContextProvider>
  )
}
