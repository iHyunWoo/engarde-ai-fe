import {fetcher} from "@/shared/lib/fetcher";

export const deleteMatch = async (matchId: number) => {
  return await fetcher(`/matches/${matchId}`, {
    method: 'DELETE',
  })
}