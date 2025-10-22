import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const deleteTechniqueAttempt = async (
  techniqueAttemptId: number
) => {
  return await apis.functional.techniques.attempts.deleteAttempt(conn, techniqueAttemptId)
}