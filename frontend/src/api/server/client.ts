import axios from "axios"
import { ENV } from "@/src/constants/env"

export function createAxiosInstance({
  token,
}: { token?: string | null }) {

  return axios.create({
    baseURL: ENV.apiUrl,
    headers: {
      "Content-Type": "application/json",
      ...(token ? {
        Authorization: `Bearer ${token}`
      } : {}),
    }
  })

}
