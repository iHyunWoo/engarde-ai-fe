import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const deleteMatch = async (matchId: number) => {
  return await apis.functional.matches.$delete(conn, matchId)
}