import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {StatisticMode} from "@/app/features/statistic/dto/statistic-mode";

export const getStatisticsV3 = async (from: string, to: string, mode: StatisticMode = 'all') => {
  return await apis.functional.statistics.v3.getStatisticsV3(conn,
    {
      from,
      to,
      mode
    }
  )
}