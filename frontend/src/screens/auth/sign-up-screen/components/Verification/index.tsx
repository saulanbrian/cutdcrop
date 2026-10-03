import { useAuth } from "@/src/api/hooks/auth/use-auth";
import { ThemedScreen, ThemedText, ActionButton } from "@/src/components/ui";
import VerificationCodeInput from "./VerificationCodeInput";
import { darkColors } from "@/src/constants/ui/colors";
import { supabase } from "@/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { MutationStatus } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native-unistyles";

function Verification({ email }: { email: string }) {

  const [verification, setVerification] = useState('')
  const [status, setStatus] = useState<MutationStatus>('idle')
  const [error, setError] = useState<AuthError>()
  const { saveUserId } = useAuth()

  styles.useVariants({
    disabled: verification.split('').length < 8
  })

  const handlePress = useCallback(async () => {
    setStatus("pending")
    setError(undefined)
    const { data, error } = await supabase.auth.verifyOtp({
      type: "email",
      email,
      token: verification
    })
    if (error || !data.session || !data.user) {
      setError(error || new AuthError("session error"))
      setStatus("error")
      return
    }
    await saveUserId(data.user.id)
    await supabase.auth.setSession(data.session)
  }, [verification, email, saveUserId])

  return (
    <ThemedScreen style={styles.screen}>
      <ThemedText
        size={"lg"}
        fw={"semiBold"}
        style={styles.text}
      >
        Enter verification
      </ThemedText>
      <VerificationCodeInput onChangeCode={setVerification} />
      {error && (
        <ThemedText
          size={"xs"}
          color={"error"}
          style={styles.error}
        >
          {error.message}
        </ThemedText>
      )}
      <ActionButton
        title={"verify"}
        status={status}
        pendingText={"verifying..."}
        onPress={handlePress}
        disabled={verification.split('').length < 8}
        style={styles.button}
      />
      <ThemedText
        size={"sm"}
        style={styles.note}
      >
        Note: not getting an otp sometimes means email is already in use.
      </ThemedText>
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
  note: {
    color: theme.colors.warning
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

export default Verification
