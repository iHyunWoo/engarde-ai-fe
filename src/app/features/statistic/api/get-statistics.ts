import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";

export const getStatistics = async (from: string, to: string) => {
  return await apis.functional.statistics.getStatistics(conn,
    {
      from,
      to,
      scope: 'all'
    }
  )
}