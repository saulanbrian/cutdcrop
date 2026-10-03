import { ErrorScreen, LoadingScreen, ThemedView } from "@/src/components/ui";
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Pdf from "react-native-pdf";
import RNFetchBlob from "react-native-blob-util";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native-unistyles";

type PdfDocumentProps = {
  path: string;
  style?: StyleProp<ViewStyle>;
};

function PdfDocument({ path, style }: PdfDocumentProps) {

  const [localPath, setLocalPath] = useState<string>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const uri = supabase.storage
      .from("summary_bucket")
      .getPublicUrl(path)
      .data
      .publicUrl
    RNFetchBlob
      .config({
        appendExt: 'pdf',
        fileCache: true
      })
      .fetch("GET", uri)
      .then(data => {
        setLocalPath(data.path())
      })
      .catch(e => {
        setFailed(true)
        Toast.show({
          type: "error",
          text1: "couldn't load pdf",
          text2: e.message,
        })
      })
  }, [path])

  if (failed) return (
    <ThemedView style={[styles.container, style]}>
      <ErrorScreen />
    </ThemedView>
  )

  if (!localPath) return (
    <ThemedView style={[styles.container, style]}>
      <LoadingScreen />
    </ThemedView>
  )

  return (
    <Pdf
      source={{ uri: localPath }}
      trustAllCerts
      style={[styles.container, style]}
    />
  )
}

const styles = StyleSheet.create(() => ({
  container: {
    flex: 1
  }
}))

export default PdfDocument
