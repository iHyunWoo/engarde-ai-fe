import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import type {UpsertTechniqueRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export const createTechnique = async (
  query: UpsertTechniqueRequest
) => {
  return await apis.functional.techniques.create(conn, query)
}