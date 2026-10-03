import { AttachmentInputButton } from "@/src/components/ui";
import getFileSize from "@/src/utils/file-system/get-file-size";
import { decode } from "base64-arraybuffer";
import * as DocumentPicket from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import { useCallback } from "react";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native-unistyles";
import { CreationDocument } from "@/src/screens/summary/summary-creation-screen/hooks/use-summary-creation-form";

const MaxDocumentSize = 5 * 1024 * 1024

type DocumentInputProps = {
  document: CreationDocument | null;
  onChange: (document: CreationDocument | null) => void;
}

function DocumentInput({ document, onChange }: DocumentInputProps) {

  styles.useVariants({ empty: !document, attachment: true })

  const pickDocument = useCallback(async () => {

    const { assets, canceled } = await DocumentPicket.getDocumentAsync({
      base64: false,
      multiple: false,
      type: "application/pdf",
    })

    if (canceled) return;
    if (assets.length < 1) {
      Toast.show({
        type: "error",
        text1: "Unknown error occured, please try again",
      })
      return
    }

    const chosenDocument = assets[0]
    let size = chosenDocument.size ?? null
    if (size === null) {
      size = await getFileSize({ uri: chosenDocument.uri })
    }
    if (!size || size > MaxDocumentSize) {
      Toast.show({
        type: "error",
        text1: "File is too large",
      })
      return
    }

    const b64 = await FileSystem.readAsStringAsync(
      chosenDocument.uri,
      { encoding: 'base64' }
    )
    const documentAsArrayBuffer = decode(b64)
    onChange({
      file: documentAsArrayBuffer,
      title: chosenDocument.name
    })

  }, [onChange])

  return (
    <AttachmentInputButton
      placeholder={"Attach your pdf"}
      selectedFileName={document?.title ?? undefined}
      onPress={() => (document ? onChange(null) : pickDocument())}
      style={[styles.input, styles.requiredInput, styles.attachmentInput]}
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

export default DocumentInput
