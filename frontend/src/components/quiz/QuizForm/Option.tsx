import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import OptionBase from "./OptionBase";

type OptionProps = {
  label: string;
  icon?: "check" | "cross";
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: StyleProp<TextStyle>;
};

function Option({
  label,
  icon,
  onPress,
  disabled = false,
  style,
  textStyle,
}: OptionProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <OptionBase
        label={label}
        icon={icon}
        style={style}
        textStyle={textStyle}
      />
    </Pressable>
  );
}

export default Option;
