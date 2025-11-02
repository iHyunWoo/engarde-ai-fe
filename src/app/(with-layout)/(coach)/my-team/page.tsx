'use client';

import { Card, CardContent } from '@/widgets/common/Card';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { useMyTeam } from '@/app/features/team/hooks/use-my-team';
import { useTeamStudentsInfinite } from '@/app/features/team/hooks/use-team-students-infinite';
import { InviteCodeSection } from '@/widgets/team/InviteCodeSection';
import { TeamMemberList } from '@/widgets/team/TeamMemberList';
import { TeamOverview } from '@/widgets/team/TeamOverview';
import { regenerateInviteCode } from '@/app/features/team/api/regenerate-invite-code';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function MyTeamPage() {
  const { data: teamData, isLoading: teamLoading } = useMyTeam();
  const { students, isLoading: studentsLoading, loaderRef, isFetchingNextPage } =
    useTeamStudentsInfinite();
  const queryClient = useQueryClient();

  const handleRegenerateInviteCode = async () => {
    if (!teamData?.data?.id) return;

    const { code, message } = await regenerateInviteCode(String(teamData.data.id));

    if (code !== 200) {
      toast.error(message);
      return;
    }

    toast.success('Invite code regenerated successfully');
    queryClient.invalidateQueries({ queryKey: ['myTeam'] });
  };

  const handleCopyInviteCode = () => {
    if (!teamData?.data?.inviteCode) return;
    navigator.clipboard.writeText(teamData.data.inviteCode);
    toast.success('Invite code copied to clipboard');
  };

  if (teamLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!teamData?.data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Team</h1>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-400">No team assigned yet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const team = teamData.data;

  return (
    <div className="p-6">
      <TeamOverview team={team} />

      <div className="space-y-6">
        <InviteCodeSection
          inviteCode={team.inviteCode}
          inviteCodeExpiresAt={team.inviteCodeExpiresAt}
          onRegenerate={handleRegenerateInviteCode}
          onCopy={handleCopyInviteCode}
        />

        {/* Students List */}
        <TeamMemberList
          members={students}
          isLoading={studentsLoading}
          loaderRef={loaderRef as React.RefObject<HTMLDivElement | null>}
          isFetchingNextPage={isFetchingNextPage}
          showTeamInfo={true}
          getMemberHref={(userId) => `/my-team/students/${userId}/matches`}
        />
      </div>
    </div>
  );
}
