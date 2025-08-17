import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getMatchList = async (
  cursor?: number,
  from?: string,
  to?: string
) => {
  return await apis.functional.matches.findManyWithPagination(conn, {
    cursor,
    from,
    to,
    limit: 10
  })
}