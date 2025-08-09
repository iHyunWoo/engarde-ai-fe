import {fetcher} from "@/shared/lib/fetcher";
import {Marking} from "@/entities/marking";

export const getMarkingList = async (matchId: number) => {
  return await fetcher<Marking[]>('/markings?matchId=' + matchId, {
    method: 'GET',
  })
}