import { CreationCover, CreationDocument } from "@/src/screens/summary/summary-creation-screen/hooks/use-summary-creation-form";
import { MutationStatus } from "@tanstack/react-query";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import CoverInput from "./CoverInput";
import DescriptionInput from "./DescriptionInput";
import DocumentInput from "./DocumentInput";
import SubmitButton from "./SubmitButton";
import TitleInput from "./TitleInput";

type SummaryCreationFormProps = {
  title: string;
  description: string;
  cover: CreationCover | null;
  document: CreationDocument | null;
  status: MutationStatus;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onCoverChange: (cover: CreationCover | null) => void;
  onDocumentChange: (document: CreationDocument | null) => void;
  onSubmit: () => void;
};

function SummaryCreationForm({
  title,
  description,
  cover,
  document,
  status,
  onTitleChange,
  onDescriptionChange,
  onCoverChange,
  onDocumentChange,
  onSubmit
}: SummaryCreationFormProps) {

  return (
    <>
      <TitleInput value={title} onChange={onTitleChange} />
      <DescriptionInput value={description} onChange={onDescriptionChange} />
      <View style={styles.attachmentInputsContainer}>
        <DocumentInput
          document={document}
          onChange={onDocumentChange}
        />
        <CoverInput
          cover={cover}
          onChange={onCoverChange}
        />
      </View>
      <SubmitButton
        title={title}
        document={document}
        status={status}
        onSubmit={onSubmit}
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  attachmentInputsContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    alignItems: "center",
  },
}));

export default SummaryCreationForm
