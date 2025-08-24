import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getTechniqueAttemptList = async (
  matchId: number
) => {
  return await apis.functional.techniques.attempts.getAttemptsByMatch(conn, {matchId});
}