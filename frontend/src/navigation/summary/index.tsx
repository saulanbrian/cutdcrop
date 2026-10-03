import SummaryDetailScreen from "@/src/screens/summary/summary-detail-screen";
import SummaryListScreen from "@/src/screens/summary/summary-list-screen";
import { SummaryStackParamList } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SummaryCreationScreen from "@/src/screens/summary/summary-creation-screen";
import useQueryUpdater from "@/src/api/hooks/use-query-updater";
import { Summary } from "@/src/api/types/summary";
import { supabase } from "@/supabase/client";
import { useEffect } from "react";
import SummaryPdfView from "@/src/screens/summary/summary-pdf-view";

const Stack = createNativeStackNavigator<SummaryStackParamList>()


export default function SummaryStackNavigator() {


  const {
    insertIntoInfiniteQuery,
    updateDataFromInfiniteQuery,
    removeDataFromInfiniteQuery
  } = useQueryUpdater<Summary>()

  useEffect(() => {
    const channel = supabase
      .channel("summaries:all")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "summaries"
        },
        ({ eventType, new: newSummary, old: oldSummary }) => {
          switch (eventType) {
            case "INSERT":
              insertIntoInfiniteQuery({
                newData: newSummary as Summary,
                queryKey: ["summaries"]
              })
              break

            case "UPDATE":
              updateDataFromInfiniteQuery({
                id: newSummary.id,
                updateFields: newSummary as Summary,
                queryKey: ["summaries"]
              })
              break

            case "DELETE":
              removeDataFromInfiniteQuery({
                queryKey: ["summaries"],
                id: oldSummary.id
              })
              break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- realtime channel is intentionally bound once; the updater helpers only close over the stable queryClient, so adding them would churn subscriptions every render for no benefit
  }, [])

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animation: "ios_from_right"
    }}>
      <Stack.Screen
        name={"SummaryList"}
        component={SummaryListScreen}
      />
      <Stack.Screen
        name={"SummaryCreation"}
        component={SummaryCreationScreen}
      />
      <Stack.Screen
        name={"SummaryDetail"}
        component={SummaryDetailScreen}
      />
      <Stack.Screen
        name={"SummaryPdfView"}
        component={SummaryPdfView}
      />
    </Stack.Navigator>
  )
}
