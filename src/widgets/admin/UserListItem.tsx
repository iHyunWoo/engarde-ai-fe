import { Card, CardContent } from '@/widgets/common/Card';
import { User } from 'lucide-react';
import { UserResponse } from '@ihyunwoo/engarde-ai-api-sdk/structures';

interface UserListItemProps {
  user: UserResponse;
}

export function UserListItem({ user }: UserListItemProps) {
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
        </div>
      </CardContent>
    </Card>
  );
}

