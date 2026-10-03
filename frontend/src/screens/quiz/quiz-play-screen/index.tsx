import { useGetQuiz } from "@/src/api/queries/quiz";
import {
  ExitConfirmationModal,
  LoadingScreen,
  ThemedAlert,
} from "@/src/components/ui";
import { useDrawer } from "@/src/context/DrawerContext";
import { QuizStackParamList } from "@/src/navigation/quiz/types";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { Suspense, useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Countdown from "./components/Countdown";
import { useQuizSound } from "@/src/context/quiz/QuizSoundProvider";
import QuizFinishView from "./components/QuizFinishView";
import QuizForm from "@/src/components/quiz/QuizForm";
import { useQuizTracking } from "./hooks/use-quiz-tracking";
import { useSubmitQuizResponse } from "./hooks/use-submit-quiz-response";

type QuizPlayScreenRouteProp = RouteProp<QuizStackParamList, "QuizPlayScreen">;

function QuizPlayScreen() {
  const { setOptions } = useDrawer();
  const {
    params: { id },
  } = useRoute<QuizPlayScreenRouteProp>();

  useEffect(() => {
    setOptions({
      swipeEnabled: false,
    });

    return () => {
      setOptions({
        swipeEnabled: true,
      });
    };
  }, [setOptions]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Content id={id} />
    </Suspense>
  );
}

const Content = ({ id }: { id: string }) => {
  const { data } = useGetQuiz(id);
  const { quizBackgroundMusic } = useQuizSound();
  const {
    question,
    totalQuestions,
    optionIds,
    score,
    isFinished,
    pick,
    reset: resetTracking,
  } = useQuizTracking(data.questions);
  const {
    mutate: submit,
    status: submitStatus,
    error: submitError,
    reset: resetSubmit,
  } = useSubmitQuizResponse();
  // Dismissing the error resets status to idle; this flag stops the effect
  // below from treating that as a fresh finish and resubmitting.
  const submitAttempted = useRef(false);
  const onCountdownEnd = useCallback(() => {
    quizBackgroundMusic.play();
  }, [quizBackgroundMusic]);

  useFocusEffect(
    useCallback(() => {
      resetTracking();
      resetSubmit();
      submitAttempted.current = false;
    }, [resetTracking, resetSubmit]),
  );

  useEffect(() => {
    if (isFinished && submitStatus === "idle" && !submitAttempted.current) {
      submitAttempted.current = true;
      submit({ quizId: id, optionIds, score });
    }
  }, [isFinished, submitStatus, optionIds, score, id, submit]);

  const handleRetry = useCallback(() => {
    submit({ quizId: id, optionIds, score });
  }, [id, optionIds, score, submit]);

  if (isFinished) {
    return (
      <>
        <QuizFinishView
          score={score}
          numberOfQuestions={totalQuestions}
          id={id}
          isSaving={submitStatus === "pending"}
        />
        {submitError && (
          <ThemedAlert
            title={"couldn't save your result"}
            text={submitError.message}
            visible
            primaryAction={{
              title: "retry",
              onDispatch: handleRetry,
            }}
            secondaryAction={{
              title: "dismiss",
              onDispatch: resetSubmit,
            }}
          />
        )}
      </>
    );
  }

  return (
    <View style={styles.screen}>
      <Countdown onCountdownEnd={onCountdownEnd}>
        <QuizForm mode="answer" question={question} onPick={pick} />
      </Countdown>
      <ExitConfirmationModal
        title={"Warning"}
        text={"Leaving this page will restart the quiz"}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  screen: {
    backgroundColor: theme.colors.primaryLight,
    flex: 1,
  },
}));

export default QuizPlayScreen;
