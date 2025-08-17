import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {CreateMatchRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures";


export const updateMatch = async (matchId: number, req: CreateMatchRequest) => {
  return await apis.functional.matches.update(conn,
    matchId,
    req,
  )
}