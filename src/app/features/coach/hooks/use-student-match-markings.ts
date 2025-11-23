import { useQuery } from '@tanstack/react-query';
import { getMarkingList } from '@/app/features/marking/api/get-marking-list';
import { queryKeys } from '@/shared/lib/query-keys';

export function useStudentMatchMarkings(matchId?: string | number) {
  return useQuery({
    queryKey: matchId ? queryKeys.coach.studentMatchMarkings(matchId) : ['coach', 'student-match-markings', 'unknown'],
    queryFn: () => {
      if (!matchId) {
        throw new Error('matchId is required');
      }
      return getMarkingList(Number(matchId));
    },
    enabled: Boolean(matchId),
  });
}
