'use client';

import React, { useState } from 'react';
import { Input } from '@/widgets/common/Input';
import { Card, CardContent } from '@/widgets/common/Card';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { useInfiniteUsers } from '@/app/features/admin/hooks/use-infinite-users';
import { UserListItem } from '@/widgets/admin/UserListItem';
import { Search } from 'lucide-react';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 검색 디바운싱
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { users, isLoading, loaderRef, isFetchingNextPage, hasNextPage } = useInfiniteUsers(
    debouncedSearch || undefined
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-400">
              {debouncedSearch ? 'No users found.' : 'No users available.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
          <div ref={loaderRef} className="h-12" />
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
