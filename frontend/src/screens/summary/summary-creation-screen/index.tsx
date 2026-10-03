import { ThemedScreen, ThemedText } from "@/src/components/ui";
import { StyleSheet } from "react-native-unistyles";
import SamplePdfModal from "./components/SamplePdfModal";
import SummaryCreationForm from "./components/SummaryCreationForm";
import { useSummaryCreationForm } from "./hooks/use-summary-creation-form";
import { useSubmitSummary } from "./hooks/use-submit-summary";

const SummaryRequirements = [
  "The title of the summary must be unique to all you summaries",
  "Your pdf file size must be not exceed 5mb",
];

function SummaryCreationScreen() {
  const {
    title,
    description,
    cover,
    document,
    setTitle,
    setDescription,
    setCover,
    setDocument,
  } = useSummaryCreationForm();

  const { status, handleSubmit } = useSubmitSummary({
    title,
    description,
    cover,
    document,
  });

  return (
    <ThemedScreen style={styles.screen}>
      <ThemedText size={"lg"} fw={"semiBold"}>
        Create a Summary
      </ThemedText>
      <SummaryCreationForm
        title={title}
        description={description}
        cover={cover}
        document={document}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onCoverChange={setCover}
        onDocumentChange={setDocument}
        onSubmit={handleSubmit}
        status={status}
      />
      <ThemedText color={"secondary"} size={"xs"}>
        Note:
      </ThemedText>
      {SummaryRequirements.map((r, i) => (
        <ThemedText key={i.toString()} size={"xs"} color={"secondary"}>
          {`${i + 1}. ${r}`}
        </ThemedText>
      ))}
      <SamplePdfModal />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
}));

export default SummaryCreationScreen;
