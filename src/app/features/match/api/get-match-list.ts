import {GetMatchListResponse} from "@/app/features/match/dto/get-match-list-response";
import {fetcher} from "@/shared/lib/fetcher";

export const getMatchList = async (cursor?: number) => {
  const params = new URLSearchParams({ limit: '10' });
  if (cursor !== undefined) {
    params.append('cursor', cursor.toString());
  }

  return await fetcher<GetMatchListResponse>(`/matches?${params.toString()}`, {
    method: 'GET'
  });
}