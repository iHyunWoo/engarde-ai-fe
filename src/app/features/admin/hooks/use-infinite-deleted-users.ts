import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getDeletedUsers } from '@/app/features/admin/api/get-deleted-users';
import type { BaseResponse__object } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { queryKeys } from '@/shared/lib/query-keys';

type DeletedUsersResponse = BaseResponse__object.o7;

export function useInfiniteDeletedUsers() {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery<DeletedUsersResponse>({
    queryKey: queryKeys.admin.deletedUsers(),
    queryFn: ({ pageParam }) => getDeletedUsers({
      cursor: pageParam as string | undefined,
    }),
    initialPageParam: undefined as string | undefined,
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

  // flatten된 users 배열 반환
  const users = query.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  return {
    ...query,
    users,
    loaderRef,
  };
}

