import { S } from "@/src/constants/styles";
import ThemedScreen from "./ThemedScreen";
import ThemedText from "./ThemedText";

function ErrorScreen() {
  return (
    <ThemedScreen style={S.centerContainer}>
      <ThemedText>an error has occured</ThemedText>
    </ThemedScreen>
  )
}

export default ErrorScreen
