import { LoadingScreen, ThemedScreen, ThemedButton } from "@/src/components/ui";
import { SummaryStackParamList } from "@/src/navigation/summary/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Suspense, useCallback } from "react";
import { StyleSheet } from "react-native-unistyles";
import SummaryList from "@/src/components/summary/SummaryList";

function SummaryListScreen() {
  const navigation = useNavigation<NavigationProp<SummaryStackParamList>>();

  const handlePress = useCallback(() => {
    navigation.navigate("SummaryCreation");
  }, [navigation]);

  return (
    <ThemedScreen style={styles.screen}>
      <Suspense fallback={<LoadingScreen />}>
        <SummaryList />
      </Suspense>
      <ThemedButton
        title={"summarize"}
        style={styles.fab}
        onPress={handlePress}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.md,
    borderRadius: theme.radii.pill,
  },
}));

export default SummaryListScreen;
