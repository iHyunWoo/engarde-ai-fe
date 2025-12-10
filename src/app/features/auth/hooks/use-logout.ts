import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/shared/hooks/use-user-store';
import { logout } from '@/app/features/auth/api/logout';
import { toast } from 'sonner';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cleanUser } = useUserStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 모든 TanStack Query 캐시 제거
      queryClient.clear();
      cleanUser();
      router.push('/login');
    },
    onError: (error) => {
      // 에러가 발생해도 로컬에서 로그아웃 처리
      queryClient.clear();
      cleanUser();
      router.push('/login');
      toast(error instanceof Error ? error.message : 'Logout failed');
    },
  });
}

