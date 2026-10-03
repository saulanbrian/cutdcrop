import { useAuth } from "@/src/api/hooks/auth/use-auth";
import { ThemedText, ThemedTextInput, ActionButton, AnimatedThemedView } from "@/src/components/ui";
import GoogleButton from "./GoogleButton";
import { darkColors } from "@/src/constants/ui/colors";
import { AuthStackNavigationProp } from "@/src/navigation/auth/types";
import { supabase } from "@/supabase/client";
import { useNavigation } from "@react-navigation/native";
import { AuthError } from "@supabase/supabase-js";
import { MutationStatus } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useAnimatedKeyboard, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

function SignInForm() {

  const { saveUserId } = useAuth()
  const keyboard = useAnimatedKeyboard()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<MutationStatus>('idle')
  const [authError, setAuthError] = useState<AuthError>()

  const hanldeSignIn = useCallback(async () => {
    setAuthError(undefined)
    setStatus('pending')
    const { data, error } = await supabase
      .auth
      .signInWithPassword({
        email,
        password
      })
    if (error) {
      setAuthError(error)
      setStatus("error")
      return
    }
    await saveUserId(data.user.id)
    setStatus('success')
    return
  }, [email, password, saveUserId])

  const rStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(
          keyboard.height.value
            ? -keyboard.height.value - 16
            : -16,
          { damping: 400 }
        )
      }
    ]
  }))

  return (
    <AnimatedThemedView
      style={[styles.actionsContainer, rStyles]}
    >
      <ThemedText
        style={styles.titleText}
        size={"lg"}
        fw={"semiBold"}
      >
        Sign in to your account
      </ThemedText>
      <ThemedTextInput
        placeholder={"example@email.com"}
        value={email}
        onChangeText={setEmail}
      />
      <ThemedTextInput
        placeholder={"password"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ActionButton
        title={"Sign In"}
        status={status}
        onPress={hanldeSignIn}
        pendingText={"signing in..."}
        disabled={!email || !password}
      />
      <SignupAnchor />
      {authError && (
        <ThemedText color={"error"}>
          {authError.message}
        </ThemedText>
      )}
      <MethodSeparator />
      <GoogleButton style={styles.googleButton} />
    </AnimatedThemedView>
  )
}

const MethodSeparator = () => {

  return (
    <View style={styles.separator}>
      <View style={styles.separatorLine} />
      <ThemedText
        style={styles.separatorText}
      >
        or
      </ThemedText>
      <View style={styles.separatorLine} />
    </View>
  )
}

const SignupAnchor = () => {

  const navigation = useNavigation<AuthStackNavigationProp>()

  const handlePress = useCallback(() => {
    navigation.navigate("SignUp")
  }, [navigation])

  return (
    <TouchableOpacity onPress={handlePress}>
      <ThemedText
        size={"xs"}
        style={styles.signUpAnchor}
      >
        don&apos;t have an account? signup instead
      </ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(theme => ({
  separator: {
    marginVertical: theme.spacing.md,
    alignItems: "center",
    flexDirection: "row"
  },
  separatorLine: {
    flex: 1,
    backgroundColor: darkColors.textSecondary,
    height: StyleSheet.hairlineWidth
  },
  separatorText: {
    color: darkColors.textSecondary,
    marginHorizontal: theme.spacing.xs
  },
  actionsContainer: {
    backgroundColor: theme.colors.primaryDark,
    borderTopRightRadius: theme.radii.lg,
    borderTopLeftRadius: theme.radii.lg,
    borderBottomWidth: 0,
    borderColor: darkColors.textPrimary,
    marginTop: "auto",
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.lg * 1.5,
    gap: theme.spacing.xs,
    zIndex: 999
  },
  googleButton: {
    marginBottom: theme.spacing.lg
  },
  signUpAnchor: {
    color: theme.colors.warning
  },
  titleText: {
    color: darkColors.textPrimary,
    marginVertical: theme.spacing.md,
    alignSelf: "center"
  }
}))

export default SignInForm
