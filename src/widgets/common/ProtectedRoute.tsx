"use client";

import { ReactNode, useEffect, useMemo } from 'react';
import { useUserInfo } from '@/app/features/auth/hooks/use-user-info';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { UserRole } from '@/entities/user-role';

interface ProtectedRouteProps {
  requiredRole?: UserRole[];
  redirectTo?: string;
  children: ReactNode;
}

export function ProtectedRoute({ 
  requiredRole, 
  redirectTo = '/login',
  children 
}: ProtectedRouteProps) {
  const { user, loading } = useUserInfo();
  const router = useRouter();
  
  // 권한 체크를 직접 계산
  const hasRequiredRole = useMemo(() => {
    if (!requiredRole || !user) return !requiredRole;
    return requiredRole.some(role => user.role === role);
  }, [requiredRole, user]);

  useEffect(() => {
    if (loading) return;
    
    // 권한이 없으면 404 처리
    if (requiredRole && !hasRequiredRole) {
      notFound();
      return;
    }
  }, [user, loading, requiredRole, redirectTo, router, hasRequiredRole]);

  // 로딩 중이거나 사용자 정보가 없으면 아무것도 렌더링하지 않음
  if (loading || !user) {
    return null;
  }

  if (!hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
}
