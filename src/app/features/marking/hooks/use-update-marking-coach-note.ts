import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMarkingCoachNote } from '@/app/features/marking/api/update-marking';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/lib/query-keys';

interface UseUpdateMarkingCoachNoteOptions {
  matchId?: string | number;
  onSuccess?: () => void;
}

export function useUpdateMarkingCoachNote({
  matchId,
  onSuccess,
}: UseUpdateMarkingCoachNoteOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { markingId: number; coachNote: string }>({
    mutationFn: async ({ markingId, coachNote }) => {
      await updateMarkingCoachNote(markingId, coachNote);
    },
    onSuccess: () => {
      onSuccess?.();
      if (matchId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.coach.studentMatchMarkings(matchId),
        });
      }
      toast.success('Coach comment saved.');
    },
    onError: () => {
      toast.error('Failed to save coach comment.');
    },
  });
}

