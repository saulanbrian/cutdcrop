import { useState } from "react";

export type CreationDocument = {
  file: ArrayBuffer;
  title: string;
}

export type CreationCover = {
  file: ArrayBuffer;
  fileName: string;
}

export function useSummaryCreationForm() {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState<CreationCover | null>(null)
  const [document, setDocument] = useState<CreationDocument | null>(null)

  return {
    title,
    description,
    cover,
    document,
    setTitle,
    setDescription,
    setCover,
    setDocument,
  }
}
