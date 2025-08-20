import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {UpsertOpponentRequest} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export const updateOpponent = async (
  id: number,
  body: UpsertOpponentRequest
) => {
  return await apis.functional.opponents.update(conn, id, body)
}