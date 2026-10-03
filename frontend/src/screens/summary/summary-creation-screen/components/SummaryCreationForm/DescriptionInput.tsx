import { ThemedTextInput } from "@/src/components/ui";
import { StyleSheet } from "react-native-unistyles";

type DescriptionInputProps = {
  value: string;
  onChange: (value: string) => void;
}

function DescriptionInput({ value, onChange }: DescriptionInputProps) {

  return (
    <ThemedTextInput
      value={value}
      onChangeText={onChange}
      placeholder={"provide a description for this summary..."}
      multiline={true}
      numberOfLines={3}
      style={[styles.input, styles.descriptionInput]}
    />
  )
}

const styles = StyleSheet.create(theme => ({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.spacing.sm,
  },
  descriptionInput: {
    padding: theme.spacing.sm,
    textAlignVertical: 'top',
    minHeight: (theme.fontSize.xs * 3) + 24
  },
}))

export default DescriptionInput
