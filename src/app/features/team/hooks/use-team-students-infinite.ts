import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getTeamStudents } from '@/app/features/team/api/get-team-students';
import { BaseResponseCursorResponseUserResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';

export function useTeamStudentsInfinite() {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery<BaseResponseCursorResponseUserResponse>({
    queryKey: ['teamStudents'],
    queryFn: ({ pageParam }) =>
      getTeamStudents({ cursor: pageParam as number | undefined, limit: 10 }),
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

  // flatten된 students 배열 반환
  const students = query.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  return {
    ...query,
    students,
    loaderRef,
  };
}

