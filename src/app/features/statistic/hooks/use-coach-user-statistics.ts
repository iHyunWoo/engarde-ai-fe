import {useCallback, useState} from "react";
import {getCoachUserStatistics} from "@/app/features/statistic/api/get-coach-user-statistics";
import {GetStatisticV2Response} from "@ihyunwoo/engarde-ai-api-sdk/structures";
import {StatisticMode} from "@/app/features/statistic/dto/statistic-mode";

export function useCoachUserStatistics(userId: string) {
  const [data, setData] = useState<GetStatisticV2Response | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (from: string, to: string, mode: StatisticMode) => {
    setLoading(true);
    try {
      const res = await getCoachUserStatistics(userId, from, to, mode);
      if (res?.code === 200 && res.data) setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { loading, data, fetchData } as const;
}

