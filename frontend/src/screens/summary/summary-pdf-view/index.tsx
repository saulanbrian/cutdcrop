import { useGetSummary } from "@/src/api/queries/summary";
import { LoadingScreen, ThemedScreen } from "@/src/components/ui";
import PdfDocument from "@/src/components/summary/PdfDocument";
import { SummaryStackParamList } from "@/src/navigation/summary/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Suspense, useEffect } from "react";
import { StyleSheet } from "react-native-unistyles";
import { useDrawer } from "@/src/context/DrawerContext";

type _RouteProp = RouteProp<SummaryStackParamList, "SummaryPdfView">;

function SummaryPdfView() {

  const { params: { summaryId } } = useRoute<_RouteProp>()
  const { setOptions } = useDrawer()

  useEffect(() => {
    setOptions({ swipeEnabled: false })

    return () => {
      setOptions({ swipeEnabled: true })
    }
  }, [setOptions])

  return (
    <ThemedScreen style={styles.screen}>
      <Suspense fallback={<LoadingScreen />}>
        <Content id={summaryId} />
      </Suspense>
    </ThemedScreen>
  )
}

const Content = ({ id }: { id: string }) => {

  const { data: summary } = useGetSummary(id)

  return <PdfDocument path={summary.document_url} />
}

const styles = StyleSheet.create(() => ({
  screen: {
    flex: 1,
    paddingHorizontal: 0
  }
}))

export default SummaryPdfView
