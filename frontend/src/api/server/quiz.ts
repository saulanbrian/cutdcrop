import { AxiosError } from "axios";
import { createAxiosInstance } from "./client";
import { markQuizError } from "@/src/api/services/quiz";

export async function processQuiz(id: string) {
  const api = createAxiosInstance({})
  try {
    const res = await api.post("quiz/generate_quiz", {
      quiz_id: id
    })
    if (res.status !== 200) {
      throw new AxiosError("Processing summary failed")
    }
  } catch (e) {
    console.log("processing summary failed: ", e)
    await markQuizError(id)
  }

}
