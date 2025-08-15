import {fetcher} from "@/shared/lib/fetcher";
import {CreateMatchResponse} from "@/app/features/match/dto/create-match-response";
import {CreateMatchRequest} from "@/app/features/match/dto/create-match-request";

export const updateMatch = async (matchId: number, req: CreateMatchRequest) => {
  return await fetcher<CreateMatchResponse>(`/matches/${matchId}`, {
    method: 'PUT',
    body: JSON.stringify(req)
  })
}