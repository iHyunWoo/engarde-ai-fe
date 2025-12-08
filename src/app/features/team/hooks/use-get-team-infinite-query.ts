import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getTeamList } from '@/app/features/team/api/get-team-list';
import { BaseResponseCursorResponseTeamListResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { queryKeys } from '@/shared/lib/query-keys';

export function useGetTeamInfiniteQuery(q?: string) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  
  const query = useInfiniteQuery<BaseResponseCursorResponseTeamListResponse>({
    queryKey: queryKeys.teams.all(q),
    queryFn: ({ pageParam }) => getTeamList(pageParam as number | undefined, q),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.code !== 200 || !lastPage.data?.nextCursor) {
        return undefined;
      }
      return lastPage.data.nextCursor;
    },
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

  // flatten된 teams 배열 반환
  const teams = query.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  return {
    ...query,
    teams,
    loaderRef,
  };
}

