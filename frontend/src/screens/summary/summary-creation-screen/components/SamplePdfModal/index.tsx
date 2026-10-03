import { ThemedText, TransparentModalView, TransparentModalViewRef } from "@/src/components/ui";
import PdfDocument from "@/src/components/summary/PdfDocument";
import { useRef } from "react";
import { Dimensions, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { darkColors } from "@/src/constants/ui/colors";
import SamplePdfModalButton from "./SamplePdfModalButton";
import TryButton from "./TryButton";

function SamplePdfModal() {

  const modalRef = useRef<TransparentModalViewRef | null>(null)

  return (
    <>
      <SamplePdfModalButton modalRef={modalRef} />
      <TransparentModalView ref={modalRef}>
        <View style={styles.container}>
          <ThemedText
            size={"lg"}
            fw={"bold"}
            style={styles.title}
          >
            Sample Pdf
          </ThemedText>
          <PdfDocument path="sample.pdf" style={styles.pdfContainer} />
          <TryButton modalRef={modalRef} />
        </View>
      </TransparentModalView>
    </>
  )
}

const styles = StyleSheet.create(theme => ({
  container: {
    gap: theme.spacing.xs
  },
  title: {
    color: darkColors.textPrimary
  },
  pdfContainer: {
    height: Dimensions.get('window').height * 0.5,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: theme.radii.sm
  },
}))

export default SamplePdfModal
