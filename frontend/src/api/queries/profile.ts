import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/src/api/services/profile";
import { Profile } from "@/src/api/types/profile";

export const useGetProfile = () => {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await getProfile()
      return profile
    },
    staleTime: 10 * 60 * 1000
  })
}
