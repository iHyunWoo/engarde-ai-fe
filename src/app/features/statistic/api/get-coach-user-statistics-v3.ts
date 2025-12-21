import * as apis from '@ihyunwoo/engarde-ai-api-sdk'
import {conn} from "@/shared/lib/api-client";
import {StatisticMode} from "@/app/features/statistic/dto/statistic-mode";

export const getCoachUserStatisticsV3 = async (userId: string, from: string, to: string, mode: StatisticMode = 'all') => {
  return await apis.functional.coaches.users.statistics.v3.getUserStatisticsV3(conn,
    userId,
    {
      from,
      to,
      mode
    }
  )
}

