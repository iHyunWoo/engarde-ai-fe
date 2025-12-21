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
import { Trash2, Settings } from 'lucide-react';
import { Counter } from '@/widgets/common/Counter';
import { updateTeamMaxMembers } from '@/app/features/team/api/update-team';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/widgets/common/Dialog';
import { useDeactivateTeam } from '@/app/features/team/hooks/use-deactivate-team';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/widgets/common/AlertDialog';

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const teamId = params.id as string;
  const { data, isLoading, error } = useTeamDetail(teamId);
  const [isCoachDialogOpen, setIsCoachDialogOpen] = useState(false);
  const [isMaxMembersDialogOpen, setIsMaxMembersDialogOpen] = useState(false);
  const [tempMaxMembers, setTempMaxMembers] = useState(10);
  const [isUpdatingMaxMembers, setIsUpdatingMaxMembers] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const { mutate: deactivateTeam, isPending: isDeactivating } = useDeactivateTeam();

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

  const handleOpenMaxMembersDialog = () => {
    setTempMaxMembers(team.maxMembers ?? 10);
    setIsMaxMembersDialogOpen(true);
  };

  const handleSaveMaxMembers = async () => {
    if (tempMaxMembers < 1) {
      toast.error('Max members must be at least 1.');
      return;
    }

    setIsUpdatingMaxMembers(true);
    try {
      const { code, message } = await updateTeamMaxMembers(teamId, { maxMembers: tempMaxMembers });

      if (code !== 200) {
        if (code === 400) {
          toast.error('The current number of members exceeds the maximum member limit.');
        } else {
          toast.error(message);
        }
        return;
      }

      toast.success('Max members updated successfully.');
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.detail(Number(teamId)) });
      setIsMaxMembersDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update max members.');
    } finally {
      setIsUpdatingMaxMembers(false);
    }
  };

  const handleDeactivate = () => {
    deactivateTeam(Number(teamId), {
      onSuccess: () => {
        setIsDeactivateDialogOpen(false);
        router.push('/teams');
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
      <TeamOverview team={team} />
        <Button onClick={handleOpenMaxMembersDialog} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Change Max Members
        </Button>
      </div>

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

        {/* Deactivate Team */}
        <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Deactivate Team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deactivate Team</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deactivate this team? The team will be deactivated and members will lose access. This action can be reversed by restoring the team.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeactivate}
                disabled={isDeactivating}
                className="bg-destructive  hover:bg-destructive/90"
              >
                {isDeactivating ? 'Deactivating...' : 'Deactivate'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Max Members Dialog */}
      <Dialog open={isMaxMembersDialogOpen} onOpenChange={setIsMaxMembersDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Max Members</DialogTitle>
            <DialogDescription>
              Set the maximum number of members for this team.<br />
              Current members: {team.members.length}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-center">
              <Counter
                label="Max Members"
                count={tempMaxMembers}
                changeCount={(delta) => {
                  const newValue = tempMaxMembers + delta;
                  if (newValue >= 1) {
                    setTempMaxMembers(newValue);
                  }
                }}
                onValueChange={(value) => {
                  if (value >= 1) {
                    setTempMaxMembers(value);
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsMaxMembersDialogOpen(false)}
                disabled={isUpdatingMaxMembers}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMaxMembers}
                disabled={isUpdatingMaxMembers || tempMaxMembers < 1}
              >
                {isUpdatingMaxMembers ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

