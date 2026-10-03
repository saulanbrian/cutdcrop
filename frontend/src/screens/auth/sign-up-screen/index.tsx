import { ThemedScreen, ThemedText, ThemedTextInput, ActionButton } from "@/src/components/ui";
import { darkColors } from "@/src/constants/ui/colors";
import { supabase } from "@/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { MutationStatus } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import Verification from "./components/Verification";

function SignUpScreen() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<AuthError>()
  const [status, setStatus] = useState<MutationStatus>("idle")
  const [verifying, setVerifying] = useState(false)

  styles.useVariants({
    disabled: !email || !password
  })

  const handlePress = useCallback(async () => {
    setStatus("pending")
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      setError(error)
      setStatus("error")
      return
    }
    setVerifying(true)
  }, [email, password])

  if (verifying) {
    return <Verification email={email} />
  }

  return (
    <ThemedScreen style={styles.screen}>
      <ThemedText
        style={styles.text}
        size={"lg"}
        fw={"semiBold"}
      >
        Enter your email
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
      {error && (
        <ThemedText
          color={"error"}
          size={"sm"}
          style={styles.error}
        >
          {error.message}
        </ThemedText>
      )}
      <ActionButton
        title={"continue"}
        status={status}
        onPress={handlePress}
        disabled={!email || !password}
        style={styles.button}
      />
    </ThemedScreen>
  )
}

const styles = StyleSheet.create(theme => ({
  error: {
    backgroundColor: darkColors.textPrimary,
    alignSelf: "flex-start",
    padding: theme.spacing.xxs,
    borderRadius: theme.radii.xs
  },
  screen: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.xs
  },
  text: {
    color: darkColors.textPrimary
  },
  button: {
    backgroundColor: theme.colors.primaryDark,
    marginVertical: theme.spacing.sm,
    variants: {
      disabled: {
        true: {
          opacity: 0.6
        },
      }
    }
  }
}))

export default SignUpScreen
