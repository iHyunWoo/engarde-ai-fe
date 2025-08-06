'use client';

import { useEffect, useState, useRef } from 'react';
import {MatchSummary} from "@/entities/match-summary";
import {getMatchList} from "@/app/features/match/api/get-match-list";
import {MatchListItem} from "@/widgets/Match/MatchListItem";

export default function MatchListPage() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    setLoading(true);
    const res = await getMatchList(cursor)

    if (!res || res.code !== 200 || !res.data) {
      setLoading(false);
      return;
    }

    const { items, nextCursor } = res.data;

    setMatches(prev => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newItems = items.filter((item) => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
    setCursor(nextCursor);
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading && cursor) {
        loadMore();
      }
    }, { threshold: 1.0 });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [cursor, loading]);

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