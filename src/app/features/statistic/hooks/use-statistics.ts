import {useCallback, useState} from "react";
import {getStatistics} from "@/app/features/statistic/api/get-statistics";
import {GetStatisticResponse} from "@ihyunwoo/engarde-ai-api-sdk/structures";

export function useStatistics() {
  const [data, setData] = useState<GetStatisticResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await getStatistics(from, to);
      if (res?.code === 200 && res.data) setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, data, fetchData } as const;
}