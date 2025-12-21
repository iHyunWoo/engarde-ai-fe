'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/widgets/common/Dialog';
import { Card, CardContent } from '@/widgets/common/Card';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { useInfiniteDeactivatedTeams } from '@/app/features/team/hooks/use-infinite-deactivated-teams';
import { useRestoreTeam } from '@/app/features/team/hooks/use-restore-team';
import { Button } from '@/widgets/common/Button';
import { RotateCcw } from 'lucide-react';
import { TeamListResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';
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
import { Users } from 'lucide-react';

interface DeactivatedTeamsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeactivatedTeamItem({ team }: { team: TeamListResponse }) {
  const [open, setOpen] = useState(false);
  const { mutate: restoreTeam, isPending } = useRestoreTeam();

  const handleRestore = () => {
    restoreTeam(Number(team.id), {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900">{team.name}</h4>
            {team.description && (
              <p className="text-sm text-gray-500 mt-1">{team.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Members: {team.memberCount}{team.maxMembers ? ` / ${team.maxMembers}` : ''}</span>
              </div>
              {team.coach ? (
                <span>Coach: {team.coach.name}</span>
              ) : (
                <span>No coach assigned</span>
              )}
            </div>
          </div>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isPending}
              >
                <RotateCcw className="w-4 h-4" />
                Restore
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restore Team</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to restore this team? The team will be active again and accessible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRestore}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPending ? 'Restoring...' : 'Restore'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

export function DeactivatedTeamsModal({ open, onOpenChange }: DeactivatedTeamsModalProps) {
  const { teams, isLoading, loaderRef, isFetchingNextPage } = useInfiniteDeactivatedTeams();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Deactivated Teams</DialogTitle>
          <DialogDescription>
            View and manage teams that have been deactivated.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
              </div>
            ) : teams.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-gray-400">
                    No deactivated teams available.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {teams.map((team) => (
                  <DeactivatedTeamItem key={team.id} team={team} />
                ))}
                <div ref={loaderRef} className="h-12" />
                {isFetchingNextPage && (
                  <div className="flex justify-center items-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

