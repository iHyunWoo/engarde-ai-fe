"use client";

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/widgets/common/ProtectedRoute';

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ProtectedRoute requiredRole={['ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}
