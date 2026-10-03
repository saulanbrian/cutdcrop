import { supabase } from "@/supabase/client";
import { getUserIdAsync } from "@/src/api/services/auth";

export type UploadCoverProps = {
  cover: ArrayBuffer;
  coverName: string;
  summaryTitle: string;
}

export async function uploadCover({
  cover,
  coverName,
  summaryTitle
}: UploadCoverProps) {

  const userId = await getUserIdAsync({ throwOnError: true })
  const formattedSummaryTitle = summaryTitle.split(' ').join('-').toLowerCase()
  const path = `${userId}/${formattedSummaryTitle}/cover/${coverName}`

  const { data, error } = await supabase.storage
    .from('summary_bucket')
    .upload(path, cover, {
      contentType: 'image/jpeg'
    })

  return { data, error, uri: path }
}

export async function uploadDocument({
  document,
  documentTitle,
  summaryTitle
}: {
  summaryTitle: string;
  document: ArrayBuffer;
  documentTitle: string
}) {

  const userId = await getUserIdAsync({ throwOnError: true })
  const formattedSummaryTitle = summaryTitle.split(' ').join('-').toLowerCase()
  const path = `${userId}/${formattedSummaryTitle}/document/${documentTitle}`

  const { data, error } = await supabase.storage
    .from("summary_bucket")
    .upload(path, document, {
      contentType: 'application/pdf'
    })

  return { data, error, uri: path }

}
