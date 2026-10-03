import { View } from "react-native";
import { AppLogo, ThemedText } from "@/src/components/ui";
import { StyleSheet } from "react-native-unistyles";
import { darkColors } from "@/src/constants/ui/colors";
import { StackHeaderProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AppHeader({
  layout: { height },
}: StackHeaderProps) {

  const { top } = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          minHeight: 100,
          paddingTop: top
        }
      ]}
    >
      <AppLogo />
      <ThemedText
        style={styles.text}
        size={"lg"}
        fw={"semiBold"}
      >
        Cut D&apos; Crop
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: "center",
    backgroundColor: theme.colors.primaryDark,
  },
  text: {
    color: darkColors.textPrimary
  }
}))

export default AppHeader
