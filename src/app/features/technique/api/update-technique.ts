import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {UpsertTechniqueRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export const updateTechnique = async (
  id: number,
  body: UpsertTechniqueRequest
) => {
  return await apis.functional.techniques.update(conn, id, body)
}