import useQueryUpdater from "@/src/api/hooks/use-query-updater";
import { requestSummary } from "@/src/api/server/summary";
import { insertSummary } from "@/src/api/services/summary";
import { uploadCover, uploadDocument } from "@/src/api/storage/summary_bucket";
import { Summary } from "@/src/api/types/summary";
import { SummaryStackParamList } from "@/src/navigation/summary/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { Keyboard } from "react-native";
import Toast from "react-native-toast-message";
import { CreationCover, CreationDocument } from "./use-summary-creation-form";

type UseSubmitSummaryArgs = {
  title: string;
  description: string;
  cover: CreationCover | null;
  document: CreationDocument | null;
};

export function useSubmitSummary({
  title,
  description,
  cover,
  document,
}: UseSubmitSummaryArgs) {
  const navigation = useNavigation<NavigationProp<SummaryStackParamList>>();
  const { insertIntoInfiniteQuery, updateDataFromInfiniteQuery } =
    useQueryUpdater<Summary>();

  const { status, mutate } = useMutation({
    mutationFn: async () => {
      const {
        data: documentUploaded,
        error: documentUploadError,
        uri: documentUrl,
      } = await uploadDocument({
        document: document!.file,
        documentTitle: document!.title,
        summaryTitle: title,
      });
      if (documentUploadError || !documentUploaded || !documentUrl) {
        throw (
          documentUploadError ||
          new Error("An error has occured upon uploading document")
        );
      }

      let coverUrl: string | null = null;

      if (cover?.file && cover?.fileName) {
        const { uri } = await uploadCover({
          cover: cover.file,
          coverName: cover.fileName,
          summaryTitle: title,
        });
        coverUrl = uri;
      }
      //can ignore error because cover_url is an optional field
      //and it will be editable in case upload doesnt work

      const data = await insertSummary({
        title,
        description: description.trim() === "" ? null : description,
        document_url: documentUrl,
        cover_url: coverUrl,
      });

      insertIntoInfiniteQuery({
        newData: {
          ...data,
          quizId: null,
        },
        queryKey: ["summaries"],
      });
      requestForSummary(data.id);

      return data;
    },
    onMutate: () => {
      Keyboard.dismiss();
    },
    onSuccess: () => {
      setTimeout(
        () =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("SummaryList"),
        1000,
      );
    },
    onError: (e) => {
      Toast.show({
        type: "error",
        text1: "couldn't create summary",
        text2: e.message,
      });
    },
  });

  const handleSubmit = useCallback(() => {
    if (document && title) {
      mutate();
    }
  }, [document, title, mutate]);

  const requestForSummary = useCallback(
    async (id: string) => {
      const data = await requestSummary(id);
      if (!data) {
        updateDataFromInfiniteQuery({
          id,
          queryKey: ["summaries"],
          updateFields: {
            status: "error",
          },
        });
      }
    },
    [updateDataFromInfiniteQuery],
  );

  return { status, handleSubmit };
}
