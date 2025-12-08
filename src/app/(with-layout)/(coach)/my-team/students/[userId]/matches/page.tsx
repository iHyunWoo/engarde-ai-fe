'use client';

import { useParams, useRouter } from 'next/navigation';
import { MatchListItem } from '@/widgets/Match/MatchListItem';
import { useStudentMatchesInfinite } from '@/app/features/coach/hooks/use-student-matches-infinite';
import { useStudentName } from '@/app/features/team/hooks/use-student-name';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { ArrowLeft, ChartLine } from 'lucide-react';
import { Button } from '@/widgets/common/Button';
import Link from 'next/link';

export default function StudentMatchesPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const { matches, isLoading, loaderRef, isFetchingNextPage } = useStudentMatchesInfinite(userId);
  const { name: studentName } = useStudentName(userId);

  const pageTitle = studentName ? `${studentName}'s Matches` : 'Student Matches';

  return (
    <main className="px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
        <Link href={`/my-team/students/${userId}/statistics`}>
          <Button>
            <ChartLine className="w-4 h-4 mr-2" />
            View Statistics
          </Button>
        </Link>
      </div>

      {isLoading && matches.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No matches found for this student.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id}>
                <MatchListItem 
                  match={match} 
                  href={`/my-team/students/${userId}/matches/${match.id}`}
                />
              </div>
            ))}
          </div>

          <div ref={loaderRef} className="h-12" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </>
      )}
    </main>
  );
}

