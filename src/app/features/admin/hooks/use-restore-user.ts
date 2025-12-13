import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreUser } from '@/app/features/admin/api/restore-user';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/lib/query-keys';

export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreUser,
    onSuccess: () => {
      toast.success('User has been restored successfully.');
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.deletedUsers() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to restore user.');
    },
  });
}

