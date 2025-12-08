import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTeamById } from '@/app/features/team/api/get-team-by-id';
import { queryKeys } from '@/shared/lib/query-keys';

export function useTeamDetail(teamId: string) {
  return useQuery({
    queryKey: queryKeys.teams.detail(Number(teamId)),
    queryFn: () => getTeamById(teamId),
    enabled: !!teamId,
  });
}

