import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {CreateMatchRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures"

export const createMatch = async (req: CreateMatchRequest) => {
  return await apis.functional.matches.create(conn, req)
}