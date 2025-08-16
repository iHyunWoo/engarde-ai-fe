import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getMarkingList = async (matchId: number) => {
  return await apis.functional.markings.list(conn, {matchId})
}