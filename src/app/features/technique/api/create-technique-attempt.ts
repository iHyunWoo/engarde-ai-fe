import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const createTechniqueAttempt = async (
  techniqueId: number,
  matchId: number
) => {
  return await apis.functional.techniques.attempts.create(conn, {techniqueId, matchId})
}