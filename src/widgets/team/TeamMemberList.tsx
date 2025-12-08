'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/widgets/common/Card';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { Users } from 'lucide-react';
import { TeamDetailResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { UserResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import Link from 'next/link';

interface TeamMemberListProps {
  members: TeamDetailResponse['members'] | UserResponse[];
  title?: string;
  isLoading?: boolean;
  loaderRef?: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage?: boolean;
  showTeamInfo?: boolean;
  getMemberHref?: (memberId: number) => string;
}

export function TeamMemberList({
  members,
  title,
  isLoading = false,
  loaderRef,
  isFetchingNextPage = false,
  showTeamInfo = false,
  getMemberHref,
}: TeamMemberListProps) {
  const displayTitle = title || `Team Members (${members.length})`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {displayTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && members.length === 0 ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No members yet</p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => {
              const href = getMemberHref?.(member.id);
              const content = (
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    {showTeamInfo && 'team' in member && member.team && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Team: {member.team.name}
                      </p>
                    )}
                  </div>
                </div>
              );

              return (
                <div key={member.id}>
                  {href ? (
                    <Link href={href} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
            {loaderRef && <div ref={loaderRef as React.RefObject<HTMLDivElement>} className="h-12" />}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

