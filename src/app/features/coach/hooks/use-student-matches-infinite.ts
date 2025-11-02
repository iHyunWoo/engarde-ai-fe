import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getStudentMatches } from '@/app/features/coach/api/get-student-matches';
import { BaseResponseCursorResponseGetMatchListResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { queryKeys } from '@/shared/lib/query-keys';

export function useStudentMatchesInfinite(
  userId: string,
  from?: string,
  to?: string
) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery<BaseResponseCursorResponseGetMatchListResponse>({
    queryKey: queryKeys.coach.studentMatches(userId, from, to),
    queryFn: ({ pageParam }) => getStudentMatches(userId, pageParam as number | undefined, from, to),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.code !== 200 || !lastPage.data?.nextCursor) {
        return undefined;
      }
      return lastPage.data.nextCursor;
    },
    enabled: !!userId,
  });

  // IntersectionObserver를 통한 자동 로드
  useEffect(() => {
    if (!loaderRef.current) return;
    if (!query.hasNextPage || query.isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  // flatten된 matches 배열 반환
  const matches = query.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  return {
    ...query,
    matches,
    loaderRef,
  };
}

