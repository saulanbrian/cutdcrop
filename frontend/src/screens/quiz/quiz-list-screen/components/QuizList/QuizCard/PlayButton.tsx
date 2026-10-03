import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/src/components/ui";
import { darkColors } from "@/src/constants/ui/colors";
import { QuizStackParamList } from "@/src/navigation/quiz/types";
import { useQuiz } from "@/src/context/quiz/QuizContext";

export const PlayButton = () => {

  const { status, id } = useQuiz()
  const navigation = useNavigation<NavigationProp<QuizStackParamList>>()
  styles.useVariants({ disabled: status !== "success" })

  const handlePress = useCallback(() => {
    if (status === "success") {
      navigation.navigate("QuizPlayScreen", { id })
    }
  }, [id, navigation, status])

  return (
    <TouchableOpacity
      style={styles.playButtonContainer}
      onPress={handlePress}
      disabled={status !== "success"}
    >
      <View style={styles.playButton}>
        <Ionicons
          name={"play"}
          color={darkColors.textPrimary}
          size={16}
        />
        <ThemedText style={styles.playButtonText}>
          start
        </ThemedText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(theme => ({
  playButton: {
    padding: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xxs,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.primary,
    variants: {
      disabled: {
        true: {
          opacity: 0.7
        }
      }
    }
  },
  playButtonContainer: {
    marginLeft: "auto"
  },
  playButtonText: {
    color: darkColors.textPrimary,
    marginRight: theme.spacing.xxs
  }
}))
