import {fetcher} from "@/shared/lib/fetcher";
import {Marking} from "@/entities/marking";

export const deleteMarking = async (markingId: number) => {
  return await fetcher<Marking>(`/markings/${markingId}`, {
    method: 'DELETE',
  })
}