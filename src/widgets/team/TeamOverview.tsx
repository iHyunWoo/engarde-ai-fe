'use client';

import { Users } from 'lucide-react';
import { TeamDetailResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';

interface TeamOverviewProps {
  team: TeamDetailResponse;
}

export function TeamOverview({ team }: TeamOverviewProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{team.name}</h1>
      {team.description && (
        <p className="text-muted-foreground mb-2">{team.description}</p>
      )}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{team.members.length} members</span>
      </div>
    </div>
  );
}

