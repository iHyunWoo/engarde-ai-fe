import {fetcher} from "@/shared/lib/fetcher";
import {GetStatisticResponse} from "@/app/features/statistic/dto/get-statistics-request";

export const getStatistics = async (from: string, to: string) => {
  const url = `/statistics?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  return await fetcher<GetStatisticResponse>(url, {
      method: 'GET',
    }
  )
}