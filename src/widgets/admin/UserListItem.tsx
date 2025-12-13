import { Card, CardContent } from '@/widgets/common/Card';
import { UserResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';
import { X } from 'lucide-react';
import { Button } from '@/widgets/common/Button';
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
import { useSoftDeleteUser } from '@/app/features/admin/hooks/use-soft-delete-user';
import { useState } from 'react';

interface UserListItemProps {
  user: UserResponse;
}

export function UserListItem({ user }: UserListItemProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteUser, isPending } = useSoftDeleteUser();

  const handleDelete = () => {
    deleteUser(Number(user.id), {
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
          {user.role !== 'COACH' && user.role !== 'ADMIN' && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                  disabled={isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to deactivate this user? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isPending ? 'Deactivating...' : 'Deactivate'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

