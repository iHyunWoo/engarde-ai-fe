import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const deleteOpponent = async (
  id: number,
) => {
  return await apis.functional.opponents.$delete(conn, id)
}