'use client';

import {MatchListItem} from "@/widgets/Match/MatchListItem";
import {useInfiniteMatchList} from "@/app/features/match/hooks/use-infinte-match-list";

export default function MatchListPage() {
  const { matches, loading, loaderRef } = useInfiniteMatchList();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Matches</h1>

      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id}>
            <MatchListItem match={match} />
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="h-12" />
      {loading && <p className="text-center text-sm text-gray-400">Loading more...</p>}
    </main>
  );
}