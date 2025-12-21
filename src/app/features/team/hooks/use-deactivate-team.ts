import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactivateTeam } from '@/app/features/team/api/deactivate-team';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/lib/query-keys';

export function useDeactivateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateTeam,
    onSuccess: () => {
      toast.success('Team has been deactivated successfully.');
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all() });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to deactivate team.');
    },
  });
}

