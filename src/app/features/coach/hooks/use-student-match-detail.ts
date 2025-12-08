import { useQuery } from '@tanstack/react-query';
import { getStudentMatch } from '@/app/features/coach/api/get-student-match';
import { queryKeys } from '@/shared/lib/query-keys';

export function useStudentMatchDetail(userId?: string, matchId?: string) {
  return useQuery({
    queryKey: userId && matchId ? queryKeys.coach.studentMatchDetail(userId, matchId) : ['coach', 'student-match-detail', 'unknown'],
    queryFn: () => {
      if (!userId || !matchId) {
        throw new Error('userId and matchId are required');
      }
      return getStudentMatch(userId, matchId);
    },
    enabled: Boolean(userId && matchId),
  });
}
