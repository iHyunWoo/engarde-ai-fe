import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCoachMatchFeedback } from '@/app/features/coach/api/update-coach-match-feedback';
import { toast } from 'sonner';
import { UpdateMatchFeedbackRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';

interface UseUpdateCoachMatchFeedbackOptions {
  matchId?: number | string;
  onSuccess?: (feedback: string | null) => void;
}

export function useUpdateCoachMatchFeedback({
  matchId,
  onSuccess,
}: UseUpdateCoachMatchFeedbackOptions) {
  const queryClient = useQueryClient();

  return useMutation<string | null, Error, string>({
    mutationFn: async (value: string) => {
      if (!matchId) {
        throw new Error('matchId is required');
      }

      const trimmed = value.trim();
      const payload: UpdateMatchFeedbackRequest =
        trimmed.length > 0 ? { coachFeedback: trimmed } : {};

      await updateCoachMatchFeedback(String(matchId), payload);
      return trimmed.length ? trimmed : null;
    },
    onSuccess: (feedback) => {
      onSuccess?.(feedback);
      queryClient.invalidateQueries({ queryKey: ['coach', 'student-match-detail'] });
      toast.success('Coach note saved.');
    },
    onError: () => {
      toast.error('Failed to save coach note.');
    },
  });
}
