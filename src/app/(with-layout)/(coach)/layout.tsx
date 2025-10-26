"use client";

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/widgets/common/ProtectedRoute';

export default function CoachLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ProtectedRoute requiredRole={['ADMIN', 'COACH']}>
      {children}
    </ProtectedRoute>
  );
}
