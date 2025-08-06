import {fetcher} from "@/shared/lib/fetcher";
import {CreateMatchResponse} from "@/app/features/match/dto/create-match-response";
import {CreateMatchRequest} from "@/app/features/match/dto/create-match-request";

export const createMatch = async (req: CreateMatchRequest) => {
  return await fetcher<CreateMatchResponse>('/matches', {
    method: 'POST',
    body: JSON.stringify(req)
  })
}