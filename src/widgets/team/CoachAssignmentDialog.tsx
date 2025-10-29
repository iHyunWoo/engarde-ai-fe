'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/widgets/common/Dialog';
import { Input } from '@/widgets/common/Input';
import { Button } from '@/widgets/common/Button';
import { Label } from '@/widgets/common/Label';
import { LoadingSpinner } from '@/widgets/common/Spinner';
import { useSuggestions } from '@/shared/hooks/use-suggestion';
import { getAllUsers } from '@/app/features/admin/api/get-all-users';
import { createCoach } from '@/app/features/admin/api/create-coach';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { UserResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';

interface CoachAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (userId: number) => void;
  teamId: number;
}

const searchUsers = async (query: string): Promise<{ data?: UserResponse[] }> => {
  const response = await getAllUsers({ q: query, limit: 10 });
  if (response.code !== 200 || !response.data) {
    return { data: [] };
  }
  return { data: response.data.items };
};

export function CoachAssignmentDialog({
  open,
  onOpenChange,
  onAssign,
  teamId,
}: CoachAssignmentDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { suggestions, loading } = useSuggestions<UserResponse>(
    searchQuery,
    searchUsers,
    open && !showCreateForm,
    { minChars: 2 }
  );

  const handleSelectUser = (user: UserResponse) => {
    setSelectedUser(user);
    setSearchQuery(`${user.name} (${user.email})`);
  };

  const handleAssign = () => {
    if (selectedUser) {
      onAssign(selectedUser.id);
      onOpenChange(false);
      setSelectedUser(null);
      setSearchQuery('');
    }
  };

  const handleCreateAccount = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    try {
      const { code, data, message } = await createCoach({
        ...newUserData,
        teamId,
      });

      if (code !== 201 || !data) {
        toast.error(message);
        return;
      }

      toast.success('Coach account created and assigned successfully');
      onAssign(data.id);
      onOpenChange(false);
      setNewUserData({ name: '', email: '', password: '' });
      setShowCreateForm(false);
    } catch (error) {
      toast.error('Failed to create coach account');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Coach</DialogTitle>
          <DialogDescription>
            Search for an existing user or create a new account to assign as coach.
          </DialogDescription>
        </DialogHeader>

        {!showCreateForm ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search User</Label>
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedUser(null);
                  }}
                  placeholder="Search by name or email..."
                  className="pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedUser(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {loading && (
                <div className="flex justify-center py-2">
                  <LoadingSpinner size="sm" />
                </div>
              )}
              {suggestions.length > 0 && !selectedUser && (
                <div className="border rounded-lg max-h-60 overflow-auto">
                  {suggestions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full text-left px-4 py-2 hover:bg-accent border-b last:border-b-0"
                    >
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </button>
                  ))}
                </div>
              )}
              {suggestions.length === 0 && searchQuery.length >= 2 && !loading && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No users found
                </p>
              )}
              {selectedUser && (
                <div className="p-4 bg-accent rounded-lg">
                  <p className="font-medium">Selected: {selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAssign}
                disabled={!selectedUser}
                className="flex-1"
              >
                Assign as Coach
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(true)}
              >
                Create New Account
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateForm(false);
                setNewUserData({ name: '', email: '', password: '' });
              }}
            >
              ← Back to Search
            </Button>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <Button
                onClick={handleCreateAccount}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Account & Assign as Coach'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

