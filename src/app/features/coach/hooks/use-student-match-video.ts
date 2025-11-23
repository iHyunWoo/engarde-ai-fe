import { useQuery } from '@tanstack/react-query';
import { getVideoReadUrl } from '@/shared/api/get-video-read-url';
import { queryKeys } from '@/shared/lib/query-keys';

export function useStudentMatchVideo(objectName?: string | null) {
  return useQuery({
    queryKey: objectName ? queryKeys.coach.studentMatchVideo(objectName) : ['coach', 'student-match-video', 'unknown'],
    queryFn: () => {
      if (!objectName) {
        throw new Error('objectName is required');
      }
      return getVideoReadUrl(objectName);
    },
    enabled: Boolean(objectName),
  });
}
