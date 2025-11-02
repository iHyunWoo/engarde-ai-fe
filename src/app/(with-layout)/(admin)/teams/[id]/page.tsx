'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/widgets/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/widgets/common/Card';
import { Input } from '@/widgets/common/Input';
import { Label } from '@/widgets/common/Label';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { useTeamDetail } from '@/app/features/team/hooks/use-team-detail';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { regenerateInviteCode } from '@/app/features/team/api/regenerate-invite-code';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/lib/query-keys';
import { CoachAssignmentDialog } from '@/widgets/team/CoachAssignmentDialog';
import { assignCoachToTeam } from '@/app/features/admin/api/assign-coach-to-team';
import { removeCoachFromTeam } from '@/app/features/admin/api/remove-coach-from-team';
import { InviteCodeSection } from '@/widgets/team/InviteCodeSection';
import { TeamMemberList } from '@/widgets/team/TeamMemberList';
import { TeamOverview } from '@/widgets/team/TeamOverview';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const teamId = params.id as string;
  const { data, isLoading, error } = useTeamDetail(teamId);
  const [isCoachDialogOpen, setIsCoachDialogOpen] = useState(false);

  const handleRegenerateInviteCode = async () => {
    if (!teamId) return;
    
    const { code, message } = await regenerateInviteCode(teamId);
    
    if (code !== 200) {
      toast.error(message);
      return;
    }
    
    toast.success('Invite code regenerated successfully');
    queryClient.invalidateQueries({ queryKey: queryKeys.teams.detail(Number(teamId)) });
  };

  const handleCopyInviteCode = () => {
    if (!data?.data?.inviteCode) return;
    navigator.clipboard.writeText(data.data.inviteCode);
    toast.success('Invite code copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-400">Failed to load team details</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const team = data.data;

  return (
    <div className="p-6">
      <TeamOverview team={team} />

      <div className="space-y-6">

        {/* Invite Code */}
        <InviteCodeSection
          inviteCode={team.inviteCode}
          inviteCodeExpiresAt={team.inviteCodeExpiresAt}
          onRegenerate={handleRegenerateInviteCode}
          onCopy={handleCopyInviteCode}
        />

        {/* Coach Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Coach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {team.coach ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{team.coach.name}</p>
                    <p className="text-sm text-muted-foreground">{team.coach.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!confirm('Are you sure you want to remove the coach from this team?')) {
                        return;
                      }

                      const { code, message } = await removeCoachFromTeam(teamId);
                      
                      if (code !== 200) {
                        toast.error(message);
                        return;
                      }

                      toast.success('Coach removed successfully');
                      queryClient.invalidateQueries({ queryKey: queryKeys.teams.detail(Number(teamId)) });
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Coach
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Search for a user to assign as coach or create a new account.
                </p>
                <Button onClick={() => setIsCoachDialogOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Search & Assign Coach
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <CoachAssignmentDialog
          open={isCoachDialogOpen}
          onOpenChange={setIsCoachDialogOpen}
          teamId={Number(teamId)}
          onAssign={async (userId) => {
            const { code, message } = await assignCoachToTeam(teamId, { userId });

            if (code !== 200) {
              toast.error(message);
              return;
            }

            toast.success('Coach assigned successfully');
            queryClient.invalidateQueries({ queryKey: queryKeys.teams.detail(Number(teamId)) });
            setIsCoachDialogOpen(false);
          }}
        />

        {/* Members */}
        <TeamMemberList members={team.members} />
      </div>
    </div>
  );
}

