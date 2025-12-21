import { useQuery } from '@tanstack/react-query';
import { getStatisticsV3 } from '@/app/features/statistic/api/get-statistics-v3';
import { StatisticMode } from '@/app/features/statistic/dto/statistic-mode';
import { queryKeys } from '@/shared/lib/query-keys';
import { GetStatisticV3Response } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export function useStatisticsV3(from: string, to: string, mode: StatisticMode = 'all', enabled: boolean = true) {
  const query = useQuery<GetStatisticV3Response | null>({
    queryKey: queryKeys.statistics.v3(from, to, mode),
    queryFn: async () => {
      const res = await getStatisticsV3(from, to, mode);
      if (res?.code === 200 && res.data) {
        return res.data;
      }
      return null;
    },
    enabled: enabled && !!from && !!to,
    staleTime: 60 * 1000, // 1분간 fresh
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data || undefined,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
