import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/app/features/auth/api/get-user-info';
import { UserRole } from '@/entities/user-role';

export function useUserInfo() {
  const query = useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: false, // 인증 실패 시 다시 시도하지 않음
    refetchOnWindowFocus: false,
  });

  return {
    user: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    hasRole: (role: UserRole[]) => {
      return role.some(r => query.data?.role === r);
    },
  };
}
