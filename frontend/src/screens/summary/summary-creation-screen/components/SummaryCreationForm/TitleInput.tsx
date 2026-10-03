import { ThemedTextInput } from "@/src/components/ui";
import { StyleSheet } from "react-native-unistyles";

type TitleInputProps = {
  value: string;
  onChange: (value: string) => void;
}

function TitleInput({ value, onChange }: TitleInputProps) {

  styles.useVariants({ empty: !value })

  return <ThemedTextInput
    value={value}
    style={[styles.input, styles.requiredInput]}
    onChangeText={onChange}
    placeholder={"title of the summmary"}
    autoFocus={true}
  />
}

const styles = StyleSheet.create(theme => ({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.spacing.sm,
  },
  requiredInput: {
    variants: {
      empty: {
        true: {
          borderColor: theme.colors.error
        }
      }
    }
  },
}))

export default TitleInput
