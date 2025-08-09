import {getNoteSuggestion} from "@/app/features/marking/api/get-note-suggestion";

import { useEffect, useRef, useState } from "react";

export function useNoteSuggestions(
  query: string,
  enabled: boolean,
  debounceMs = 300,
  maxWaitMs = 600,
  minChars = 2
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seqRef = useRef(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const maxTimer = useRef<NodeJS.Timeout | null>(null);

  // 요청 함수
  const fire = async (q: string) => {
    const currentSeq = ++seqRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await getNoteSuggestion(q);
      if (currentSeq !== seqRef.current) return; // 오래된 응답 무시
      const data = res?.data ?? [];
      setSuggestions(Array.isArray(data) ? data : []);
    } catch {
      if (currentSeq !== seqRef.current) return;
      setError("Failed to fetch suggestions");
      setSuggestions([]);
    } finally {
      if (currentSeq === seqRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const q = (query ?? "").trim();

    // 정리 함수
    const clearTimers = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (maxTimer.current) clearTimeout(maxTimer.current);
      debounceTimer.current = null;
      maxTimer.current = null;
    };

    if (!enabled || q.length < minChars) {
      clearTimers();
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    // 입력이 바뀔 때마다 디바운스 타이머 갱신
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fire(q);
      // 요청되면 max 타이머도 초기화
      if (maxTimer.current) {
        clearTimeout(maxTimer.current);
        maxTimer.current = null;
      }
    }, debounceMs);

    // 최대 대기시간 타이머
    if (!maxTimer.current && maxWaitMs > 0) {
      maxTimer.current = setTimeout(() => {
        // 디바운스 예약이 있더라도 즉시 요청
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
          debounceTimer.current = null;
        }
        fire(q);
        // 이후 새 입력이 오면 새 max 타이머가 다시 설정됨
        maxTimer.current = null;
      }, maxWaitMs);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, [query, enabled, debounceMs, maxWaitMs, minChars]);

  return { suggestions, loading, error };
}