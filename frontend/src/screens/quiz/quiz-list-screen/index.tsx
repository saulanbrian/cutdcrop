import {
  LoadingScreen,
  ThemedButton,
  ThemedScreen,
  TransparentModalView,
  TransparentModalViewRef,
} from "@/src/components/ui";
import { Suspense, useRef } from "react";
import { StyleSheet } from "react-native-unistyles";
import QuizCreationModalContent from "./components/QuizCreationModalContent";
import QuizList from "./components/QuizList";

function QuizListScreen() {
  const modalRef = useRef<TransparentModalViewRef>(null);

  return (
    <ThemedScreen>
      <Suspense fallback={<LoadingScreen />}>
        <QuizList />
      </Suspense>
      <ThemedButton
        title={"create quiz"}
        style={styles.fab}
        onPress={() => {
          modalRef.current?.toggle();
        }}
      />
      <TransparentModalView ref={modalRef}>
        <QuizCreationModalContent toggle={() => modalRef.current?.toggle()} />
      </TransparentModalView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.md,
    borderRadius: theme.radii.pill,
  },
}));

export default QuizListScreen;
