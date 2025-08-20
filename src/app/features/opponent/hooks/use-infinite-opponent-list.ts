import {useEffect, useRef, useState} from "react";
import {getOpponentList} from "@/app/features/opponent/api/get-opponent-list";
import {toast} from "sonner";
import {Opponent} from "@/entities/opponent";

export function useInfiniteOpponentList() {
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    setLoading(true);

    const { code, data, message } = await getOpponentList(cursor);

    if (code !== 200 || !data) {
      toast.error(message);
      return;
    }

    const { items, nextCursor } = data;
    if (!nextCursor) setHasMore(false);

    setOpponents((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newItems = items.filter((item) => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });

    setCursor(nextCursor ?? undefined);
    setLoading(false);
  };

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
    opponents,
    setOpponents,
    loading,
    loaderRef,
    fetchData: loadMore,
    hasMore
  };
}