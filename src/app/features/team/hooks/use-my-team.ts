import { useQuery } from '@tanstack/react-query';
import { getMyTeam } from '@/app/features/team/api/get-my-team';

export function useMyTeam() {
  return useQuery({
    queryKey: ['myTeam'],
    queryFn: getMyTeam,
  });
}

