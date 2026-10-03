import { ThemedText } from "@/src/components/ui";
import { S } from "@/src/constants/styles";
import { darkColors } from "@/src/constants/ui/colors";
import { useQuizSound } from "@/src/context/quiz/QuizSoundProvider";
import { useFocusEffect } from "@react-navigation/native";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type CountdownProps = PropsWithChildren<{
  onCountdownEnd?: () => void;
}>;

function Countdown({ onCountdownEnd, children }: CountdownProps) {
  const { countdownTick } = useQuizSound();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onCountdownEnd?.();
      return;
    }

    countdownTick.play();
    const id = setTimeout(() => setCount((count) => count - 1), 1000);

    return () => clearTimeout(id);
  }, [count, countdownTick, onCountdownEnd]);

  useFocusEffect(
    useCallback(() => {
      setCount(3);
    }, []),
  );

  return (
    <View style={styles.container}>
      {count > 0 ? (
        <View style={S.centerContainer}>
          <ThemedText style={styles.count}>{count}</ThemedText>
        </View>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  count: {
    fontSize: 80,
    fontWeight: "800",
    color: darkColors.textPrimary,
  },
}));

export default Countdown;
