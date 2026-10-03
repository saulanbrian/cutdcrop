import { ThemedText } from "@/src/components/ui";
import { darkColors } from "@/src/constants/ui/colors";
import { Entypo } from "@expo/vector-icons";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type OptionBaseProps = {
  label: string;
  icon?: "check" | "cross";
  picked?: boolean;
  correct?: boolean;
  reveal?: boolean;
  style?: ViewStyle;
  textStyle?: StyleProp<TextStyle>;
};

function OptionBase({
  label,
  icon,
  picked = false,
  correct = false,
  reveal = false,
  style,
  textStyle,
}: OptionBaseProps) {
  const highlighted = reveal && picked;
  const showCorrect = highlighted && correct;
  const showWrong = highlighted && !correct;

  return (
    <View
      style={[
        styles.button,
        showCorrect && styles.correct,
        showWrong && styles.wrong,
        style,
      ]}
    >
      {icon === "check" ? (
        <Entypo name={"check"} size={40} color={darkColors.textPrimary} />
      ) : icon === "cross" ? (
        <Entypo name={"cross"} size={40} color={darkColors.textPrimary} />
      ) : (
        <ThemedText style={[styles.buttonText, textStyle]}>
          {label}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.spacing.sm,
    borderColor: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.textPrimary,
  },
  correct: {
    backgroundColor: theme.colors.success,
  },
  wrong: {
    backgroundColor: theme.colors.error,
  },
}));

export default OptionBase;
