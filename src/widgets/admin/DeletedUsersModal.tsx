'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/widgets/common/Dialog';
import { Card, CardContent } from '@/widgets/common/Card';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { useInfiniteDeletedUsers } from '@/app/features/admin/hooks/use-infinite-deleted-users';
import { useRestoreUser } from '@/app/features/admin/hooks/use-restore-user';
import { Button } from '@/widgets/common/Button';
import { RotateCcw } from 'lucide-react';
import { UserResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/widgets/common/AlertDialog';
import { useState } from 'react';

interface DeletedUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeletedUserItem({ user }: { user: UserResponse }) {
  const [open, setOpen] = useState(false);
  const { mutate: restoreUser, isPending } = useRestoreUser();

  const handleRestore = () => {
    restoreUser(Number(user.id), {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900">{user.name}</h4>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {user.role && (
                <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                  {user.role}
                </span>
              )}
              {'team' in user && user.team ? (
                <span className="inline-block px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">
                  Team: {user.team.name}
                </span>
              ) : (
                <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">
                  No Team
                </span>
              )}
            </div>
          </div>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isPending}
              >
                <RotateCcw className="w-4 h-4" />
                Restore
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restore User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to restore this user? The user will be able to access the system again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRestore}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPending ? 'Restoring...' : 'Restore'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

export function DeletedUsersModal({ open, onOpenChange }: DeletedUsersModalProps) {
  const { users, isLoading, loaderRef, isFetchingNextPage } = useInfiniteDeletedUsers();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Deactivated Users</DialogTitle>
          <DialogDescription>
            View and manage users who have been deactivated.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
              </div>
            ) : users.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-gray-400">
                    No deactivated users available.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {users.map((user) => (
                  <DeletedUserItem key={user.id} user={user} />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

