import { ThemedScreen, ThemedText } from "@/src/components/ui";
import { S } from "@/src/constants/styles";
import { darkColors, lightColors } from "@/src/constants/ui/colors";
import { QuizNavigationProp } from "@/src/navigation/quiz/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { runOnJS, SharedValue, useAnimatedReaction, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";


type QuizFinishViewProps = {
  score: number;
  numberOfQuestions: number;
  id: string;
  isSaving: boolean;
}

function QuizFinishView({
  score: finalScore,
  numberOfQuestions,
  id,
  isSaving
}: QuizFinishViewProps) {

  const score = useSharedValue(0)

  useEffect(() => {
    score.value = withTiming(finalScore, { duration: 1500 })
  }, [finalScore, score])

  return (
    <ThemedScreen style={[S.centerContainer, styles.screen]}>
      <DisplayScore score={score} />
      <View style={styles.buttonsContainer}>
        {isSaving && (
          <ThemedText size={"sm"} style={styles.savingHint}>
            saving your result…
          </ThemedText>
        )}
        <ViewResultButton id={id} disabled={isSaving} />
        <SkipButton />
      </View>
    </ThemedScreen>
  )
}

const DisplayScore = ({
  score
}: { score: SharedValue<number> }) => {

  const [display, setDisplay] = useState(0)

  useAnimatedReaction(
    () => score.value,
    (current) => {
      runOnJS(setDisplay)(Math.round(current))
    }
  )

  return (
    <View>
      <ThemedText style={styles.score}>
        {display}
      </ThemedText>
    </View>
  )

}

const ViewResultButton = ({ id, disabled }: { id: string; disabled: boolean }) => {

  const navigation = useNavigation<QuizNavigationProp>()

  const handlePress = useCallback(() => {
    navigation.navigate("QuizResult", { id })
  }, [id, navigation])

  return (
    <TouchableOpacity
      style={[
        styles.mainButton,
        styles.viewResultButton,
        disabled && styles.disabledButton
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <ThemedText
        fw={"semiBold"}
        style={styles.viewResultButtonText}
      >
        View Result
      </ThemedText>
    </TouchableOpacity>
  )
}

const SkipButton = () => {

  const navigation = useNavigation()

  const handlePress = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.mainButton,
        styles.skipButton
      ]}
    >
      <FontAwesome6
        name={"arrow-right-long"}
        color={lightColors.textSecondary}
        size={20}
      />
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create(theme => ({
  buttonsContainer: {
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.xs
  },
  disabledButton: {
    opacity: 0.6
  },
  mainButton: {
    borderRadius: theme.radii.pill,
    padding: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center"
  },
  screen: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: theme.spacing.md
  },
  skipButton: {
    backgroundColor: darkColors.textPrimary,
  },
  score: {
    fontSize: 120,
    fontWeight: "800",
    color: darkColors.textPrimary
  },
  savingHint: {
    color: darkColors.textPrimary,
    textAlign: "center"
  },
  viewResultButton: {
    borderColor: darkColors.textPrimary,
    borderWidth: 2,
  },
  viewResultButtonText: {
    color: darkColors.textPrimary,
    fontSize: theme.fontSize.sm,
    letterSpacing: 1.5
  }
}))

export default QuizFinishView
