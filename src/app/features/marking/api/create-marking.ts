import {fetcher} from "@/shared/lib/fetcher";
import {CreateMarkingRequest} from "@/app/features/marking/dto/create-marking-request";
import {Marking} from "@/entities/marking";

export const createMarking = async (req: CreateMarkingRequest) => {
  return await fetcher<Marking>('/markings', {
    method: 'POST',
    body: JSON.stringify(req)
  })
}