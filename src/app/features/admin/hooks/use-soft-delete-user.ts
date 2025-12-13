import { useMutation, useQueryClient } from '@tanstack/react-query';
import { softDeleteUser } from '@/app/features/admin/api/soft-delete-user';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/lib/query-keys';

export function useSoftDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeleteUser,
    onSuccess: () => {
      toast.success('User has been deactivated successfully.');
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to deactivate user.');
    },
  });
}

