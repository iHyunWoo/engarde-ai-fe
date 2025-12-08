import Link from 'next/link';
import { Card, CardContent } from '@/widgets/common/Card';
import { TeamListResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { Users } from 'lucide-react';

interface TeamListItemProps {
  team: TeamListResponse;
}

export function TeamListItem({ team }: TeamListItemProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold">{team.name}</h4>
            {team.description && (
              <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Members: {team.memberCount}{team.maxMembers ? ` / ${team.maxMembers}` : ''}</span>
              </div>
              {team.coach ? (
                <span>Coach: {team.coach.name}</span>
              ) : (
                <span>No coach assigned yet</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}

