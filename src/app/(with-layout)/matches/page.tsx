'use client';

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import {MatchSummary} from "@/entities/match-summary";
import {getMatchList} from "@/app/features/match/api/get-match-list";
import {formatDate} from "@/shared/lib/format-date";

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

    setMatches(prev => [...prev, ...items]);
    console.log(matches)
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
          <div
            key={match.id}
            className="flex items-center gap-4 p-4 border rounded-md shadow-sm hover:shadow-md transition"
          >
            {match.thumbnailUrl && (
              <Image
                src={match.thumbnailUrl}
                alt={match.tournamentName}
                className="w-28 h-16 object-cover rounded"
                width={200}
                height={100}
              />
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl">{match.tournamentName}</h3>
              <p className="font-medium truncate text-gray-800">
                vs {match.opponentName}
              </p>
              <p className="text-sm text-gray-500">
                Score: {match.myScore} - {match.opponentScore}
              </p>
            </div>

            <p>{formatDate(match.tournamentDate)}</p>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="h-12" />
      {loading && <p className="text-center text-sm text-gray-400">Loading more...</p>}
    </main>
  );
}