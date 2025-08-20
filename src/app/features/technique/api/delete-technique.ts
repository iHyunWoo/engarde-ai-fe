import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const deleteTechnique = async (
  id: number,
) => {
  return await apis.functional.techniques.$delete(conn, id)
}