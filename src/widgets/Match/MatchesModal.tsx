'use client';

import { Button } from '@/widgets/common/Button';
import {useInfiniteMatchList} from "@/app/features/match/hooks/use-infinte-match-list";
import {formatDate} from "@/shared/lib/format-date";
import {useEffect} from "react";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

export default function MatchesModal({
                                       open,
                                       onCloseAction,
                                       from,
                                       to,
                                     }: {
  open: boolean;
  onCloseAction: () => void;
  from: string;
  to: string;
}) {
  // 페이징 상태
  const { matches, loading, loaderRef, fetchData, hasMore } = useInfiniteMatchList(from, to);

  useEffect(() => {
    fetchData()
  }, [from, to])

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCloseAction}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-3xl max-h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900">Matches</h3>
          <Button size="sm" variant="outline" onClick={onCloseAction} className="text-black hover:text-black">
            Close
          </Button>
        </div>

        <div className="overflow-auto max-h-[70vh]">
          {matches.length === 0 && !loading ? (
            <Empty />
          ) : (
            <ul className="divide-y w-full">
              {matches.map((match) => (
                <li
                  key={match.id}
                  className="w-full px-4 py-3"
                >
                  <Link
                    href={`/matches/${match.id}`}
                    className="flex w-full items-center gap-4 p-4 rounded-md hover:shadow-sm transition"
                  >
                    <div className="w-full flex-1">
                      <h3 className="font-bold text-xl">{match.tournamentName}</h3>
                      <p className="font-medium truncate text-gray-800">
                        vs {match.opponentName}({match.opponentTeam})
                      </p>
                      <p className="text-sm text-gray-500">
                        Score: {match.myScore} - {match.opponentScore}
                      </p>
                    </div>

                    <p>{formatDate(match.tournamentDate)}</p>
                    <ChevronRight/>
                  </Link>
                </li>
              ))}
            </ul>
          )}


          {/* 하단: 더보기 / 로딩 / 끝 */}
          <div className="p-4 flex items-center justify-center">
            {hasMore ? (
              <Button onClick={() => fetchData()} disabled={loading}>
                {loading ? 'Loading…' : 'Load more'}
              </Button>
            ) : matches.length > 0 ? (
              <div className="text-xs text-gray-500">No more matches</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="py-16 text-center text-sm text-gray-500">
      No matches in this period.
    </div>
  );
}

function Spinner() {
  return (
    <div className="animate-spin w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent" />
  );
}