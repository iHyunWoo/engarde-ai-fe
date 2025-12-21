import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreTeam } from '@/app/features/team/api/restore-team';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/lib/query-keys';

export function useRestoreTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTeam,
    onSuccess: () => {
      toast.success('Team has been restored successfully.');
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.deactivated() });
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all() });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to restore team.');
    },
  });
}

