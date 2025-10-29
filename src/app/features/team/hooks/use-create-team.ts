import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTeam } from '@/app/features/team/api/create-team';
import { CreateTeamRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { queryKeys } from '@/shared/lib/query-keys';

export function useCreateTeam() {
  const queryClient = useQueryClient();

  const handleCreateTeam = async (req: CreateTeamRequest) => {
    const { code, data, message } = await createTeam({
      ...req,
    });

    if (code !== 201 || !data) {
      toast.error(message);
      return;
    }

    toast.success('Team created successfully');
    queryClient.invalidateQueries({ queryKey: queryKeys.teams.all() });
  };

  return { handleCreateTeam };
}

