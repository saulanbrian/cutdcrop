import { AnimatedActionButton } from "@/src/components/ui";
import { MutationStatus } from "@tanstack/react-query";
import { StyleSheet } from "react-native-unistyles";
import { CreationDocument } from "@/src/screens/summary/summary-creation-screen/hooks/use-summary-creation-form";

type SubmitButtonProps = {
  title: string;
  document: CreationDocument | null;
  status: MutationStatus;
  onSubmit: () => void;
}

function SubmitButton({
  title,
  document,
  status,
  onSubmit
}: SubmitButtonProps) {

  return (
    <AnimatedActionButton
      status={status}
      title={"submit"}
      onPress={onSubmit}
      disabled={!document || !title.trim() || status === "pending"}
      textStyle={styles.buttonText}
      style={styles.submitButton}
    />
  );
}

const styles = StyleSheet.create(theme => ({
  buttonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold"
  },
  submitButton: {
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg
  },
}));

export default SubmitButton
