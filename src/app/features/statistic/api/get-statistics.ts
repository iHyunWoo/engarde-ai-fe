import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {StatisticMode} from "@/app/features/statistic/dto/statistic-mode";

export const getStatistics = async (from: string, to: string, mode: StatisticMode = 'all') => {
  return await apis.functional.statistics.v2.getStatisticsV2(conn,
    {
      from,
      to,
      mode
    }
  )
}