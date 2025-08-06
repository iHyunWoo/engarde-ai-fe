import {fetcher} from "@/shared/lib/fetcher";
import {Match} from "@/entities/match";

export const getMatch = async (id: number, cookie?: string) => {
  return await fetcher<Match>(`/matches/${id}`, {
      method: 'GET',
    }, {
      headers: cookie ? {cookie} : {},
    }
  )
}