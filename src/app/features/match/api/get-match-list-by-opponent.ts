import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getMatchListByOpponent = async (opponentId: number) => {
  return await apis.functional.matches.opponent.getMatchByOpponent(conn, {opponentId})
}