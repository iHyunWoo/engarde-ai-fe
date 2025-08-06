import { useEffect, useRef, useState } from 'react';
import {getMatchList} from "@/app/features/match/api/get-match-list";
import {MatchSummary} from "@/entities/match-summary";

export function useInfiniteMatchList() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    setLoading(true);

    const res = await getMatchList(cursor);
    if (!res || res.code !== 200 || !res.data) {
      setLoading(false);
      return;
    }

    const { items, nextCursor } = res.data;

    setMatches((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newItems = items.filter((item) => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });

    setCursor(nextCursor);
    setLoading(false);
  };

  // 최초 1회 불러오기
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IntersectionObserver
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

  return {
    matches,
    loading,
    loaderRef,
  };
}