import {useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {Technique} from "@/entities/technique";
import {getTechniqueList} from "@/app/features/technique/api/get-technique-list";

export function useInfiniteTechniqueList() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    setLoading(true);

    const { code, data, message } = await getTechniqueList(cursor);

    if (code !== 200 || !data) {
      toast.error(message);
      return;
    }

    const { items, nextCursor } = data;
    if (!nextCursor) setHasMore(false);

    setTechniques((prev) => {
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
        fetchData();
      }
    }, { threshold: 1.0 });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [cursor, loading]);

  return {
    techniques,
    setTechniques,
    loading,
    loaderRef,
    fetchData,
    hasMore
  };
}