import { AttachmentInputButton } from "@/src/components/ui";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import { useCallback } from "react";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native-unistyles";
import { CreationCover } from "@/src/screens/summary/summary-creation-screen/hooks/use-summary-creation-form";

type CoverInputProps = {
  cover: CreationCover | null;
  onChange: (cover: CreationCover | null) => void;
}

function CoverInput({ cover, onChange }: CoverInputProps) {

  styles.useVariants({ attachment: true })

  const pickImage = useCallback(async () => {
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: false,
      aspect: [9, 12]
    })
    if (canceled || assets.length < 1) {
      Toast.show({
        type: "error",
        text1: "Unknown error occured, please try again",
      })
      return
    }
    const image = assets[0]
    const b64 = await FileSystem.readAsStringAsync(
      image.uri,
      { encoding: 'base64' }
    )
    const coverArrayBuffer = decode(b64)
    onChange({
      file: coverArrayBuffer,
      fileName: image.fileName ?? "cover_image.jpeg"
    })
  }, [onChange])

  return (
    <AttachmentInputButton
      placeholder={"Attach cover image"}
      selectedFileName={cover?.fileName ?? undefined}
      onPress={() => (cover ? onChange(null) : pickImage())}
      style={[styles.input, styles.attachmentInput]}
    />
  )
}

const styles = StyleSheet.create(theme => ({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.spacing.sm,
    variants: {
      attachment: {
        true: {
          borderRadius: theme.radii.pill,
          flex: 1
        }
      }
    }
  },
  attachmentInput: {
    height: 40,
    borderRadius: theme.spacing.md
  },
}))

export default CoverInput
