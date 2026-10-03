import { AxiosError } from "axios";
import { createAxiosInstance } from "./client";
import { markSummaryError } from "@/src/api/services/summary";

export async function requestSummary(id: string) {
  const api = createAxiosInstance({})
  try {
    const res = await api.post(`summary/request_summary`, {
      id
    })
    if (res.status !== 202) {
      throw new AxiosError("summary request failed")
    }
    return res
  } catch (e) {
    console.log("summary request failed", e)
    await markSummaryError(id)
  }
}
