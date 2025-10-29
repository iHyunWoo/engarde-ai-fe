'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/widgets/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/widgets/common/Card';
import { Input } from '@/widgets/common/Input';
import { Label } from '@/widgets/common/Label';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { useTeamDetail } from '@/app/features/team/hooks/use-team-detail';
import { ArrowLeft, Copy, RefreshCw, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { regenerateInviteCode } from '@/app/features/team/api/regenerate-invite-code';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/lib/query-keys';
import { CoachAssignmentDialog } from '@/widgets/team/CoachAssignmentDialog';
import { assignCoachToTeam } from '@/app/features/admin/api/assign-coach-to-team';
import { removeCoachFromTeam } from '@/app/features/admin/api/remove-coach-from-team';
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

  const isInviteCodeExpired = () => {
    if (!data?.data?.inviteCodeExpiresAt) return false;
    return new Date(data.data.inviteCodeExpiresAt) < new Date();
  };

  const needsRegeneration = !data?.data?.inviteCode || isInviteCodeExpired();

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
      <h1 className="text-2xl font-bold mb-6">{team.name}</h1>

      <div className="space-y-6">
        {/* Team Info */}
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {team.description || 'No description'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Invite Code */}
        <Card>
          <CardHeader>
            <CardTitle>Invite Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {needsRegeneration ? (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800 mb-4">
                  {!team.inviteCode
                    ? 'No invite code generated yet.'
                    : 'Invite code has expired.'}
                </p>
                <Button onClick={handleRegenerateInviteCode}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Invite Code
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={team.inviteCode}
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={handleCopyInviteCode}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={handleRegenerateInviteCode}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
                {team.inviteCodeExpiresAt && (
                  <p className="text-xs text-muted-foreground">
                    Expires at: {new Date(team.inviteCodeExpiresAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Members ({team.members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {team.members.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No members yet
              </p>
            ) : (
              <div className="space-y-2">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

