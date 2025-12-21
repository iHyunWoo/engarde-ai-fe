'use client';

import { useState } from 'react';
import { Button } from '@/widgets/common/Button';
import { Card, CardContent } from '@/widgets/common/Card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/widgets/common/Dialog';
import { useGetTeamInfiniteQuery } from '@/app/features/team/hooks/use-get-team-infinite-query';
import { useCreateTeam } from '@/app/features/team/hooks/use-create-team';
import { TeamListItem } from '@/widgets/team/TeamListItem';
import { TeamForm } from '@/widgets/team/TeamForm';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { Plus, Users } from 'lucide-react';
import { CreateTeamRequest } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { DeactivatedTeamsModal } from '@/widgets/team/DeactivatedTeamsModal';

export default function TeamsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deactivatedTeamsModalOpen, setDeactivatedTeamsModalOpen] = useState(false);
  const { teams, isLoading, loaderRef, isFetchingNextPage, hasNextPage } = useGetTeamInfiniteQuery();
  const { handleCreateTeam } = useCreateTeam();

  const handleSubmit = async (team: CreateTeamRequest) => {
    await handleCreateTeam(team);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Team Management</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setDeactivatedTeamsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Deactivated Teams
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
            </DialogHeader>
            <TeamForm
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      ) : teams.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-400">No teams created yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {teams.map((team) => (
            <TeamListItem key={team.id} team={team} />
          ))}
          <div ref={loaderRef} className="h-12" />
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      )}
      <DeactivatedTeamsModal open={deactivatedTeamsModalOpen} onOpenChange={setDeactivatedTeamsModalOpen} />
    </div>
  );
}
