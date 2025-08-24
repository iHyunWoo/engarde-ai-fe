import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const updateTechniqueAttemptCounter = async (techniqueAttemptId: number, delta: number) => {
  return await apis.functional.techniques.attempts.updateAttempt(conn, techniqueAttemptId, {delta})
}