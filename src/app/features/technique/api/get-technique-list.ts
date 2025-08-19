import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getTechniqueList = async (
  cursor?: number,
  limit: number = 10
) => {
  return await apis.functional.techniques.findAllByPagination(conn, {
    cursor,
    limit
  })
}