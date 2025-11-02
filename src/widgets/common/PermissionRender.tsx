import { ReactNode } from 'react';
import { useUserInfo } from '@/app/features/auth/hooks/use-user-info';
import { UserRole } from '@/entities/user-role';

interface PermissionRenderProps {
  requiredRole?: UserRole;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionRender({ 
  requiredRole, 
  fallback = null, 
  children 
}: PermissionRenderProps) {
  const { user, loading, hasRole } = useUserInfo();

  // 로딩 중이면 아무것도 렌더링하지 않음
  if (loading) {
    return null;
  }

  // 사용자 정보가 없으면 fallback 렌더링
  if (!user) {
    return <>{fallback}</>;
  }

  // 역할 체크
  if (requiredRole && !hasRole([requiredRole])) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}