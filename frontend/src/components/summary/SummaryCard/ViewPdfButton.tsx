import { useSummary } from "@/src/context/summary/SummaryContext";
import { SummaryNavigationProp } from "@/src/navigation/summary/types";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/src/components/ui";
import { useUnistyles } from "react-native-unistyles";
import { useCallback } from "react";
import ModalActionButton from "./ModalActionButton";
import { FontAwesome } from "@expo/vector-icons";

function ViewPdfButton() {

  const navigation = useNavigation<SummaryNavigationProp>()
  const { colors } = useUnistyles().theme
  const { id } = useSummary()

  const handlePress = useCallback(() => {
    navigation.navigate("SummaryPdfView", { summaryId: id })
  }, [id, navigation])

  return (
    <ModalActionButton onPress={handlePress}>
      <FontAwesome
        name={"file-pdf-o"}
        size={20}
        color={colors.primary}
      />
      <ThemedText size={"xxs"} color={"themePrimary"}>
        view pdf
      </ThemedText>
    </ModalActionButton>
  )
}


export default ViewPdfButton
