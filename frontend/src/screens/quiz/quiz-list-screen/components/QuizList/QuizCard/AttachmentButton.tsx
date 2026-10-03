import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/src/components/ui";
import { RootNavigatorParamList } from "@/src/navigation/types";
import { useQuiz } from "@/src/context/quiz/QuizContext";

export const AttachmentButton = () => {

  const { colors } = useUnistyles().theme
  const { ref: summaryId } = useQuiz()
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>()

  const handlePress = useCallback(() => {
    navigation.navigate("Summary", {
      screen: "SummaryDetail",
      params: { id: summaryId }
    })
  }, [navigation, summaryId])

  return (
    <TouchableOpacity
      style={styles.attachmentButton}
      onPress={handlePress}
    >
      <Ionicons
        name={"open-outline"}
        size={16}
        color={colors.secondary}
      />
      <ThemedText size={"xs"} color={"secondary"}>
        read summary
      </ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(theme => ({
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs
  }
}))
