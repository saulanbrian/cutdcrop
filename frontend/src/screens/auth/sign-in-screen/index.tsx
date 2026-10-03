import { ThemedScreen } from "@/src/components/ui";
import LottieView from "lottie-react-native";
import { Dimensions, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import SignInForm from "./components/SignInForm";

function SignInScreen() {

  const { colors } = useUnistyles().theme

  return (
    <ThemedScreen style={styles.screen}>
      <View style={styles.lottieContainer}>
        <LottieView
          source={require("@/assets/lotties/welcome_character.json")}
          style={styles.lottieView}
          autoPlay
        />
      </View>
      <View style={{
        backgroundColor: colors.primaryDark,
        flex: 1
      }}>
        <SignInForm />
      </View>
    </ThemedScreen>
  )
}

const styles = StyleSheet.create(theme => ({
  lottieContainer: {
    flex: 1
  },
  screen: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 0,
  },
  lottieView: {
    width: Dimensions.get("screen").width,
    aspectRatio: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
}))

export default SignInScreen
