'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LayoutShell from '@/components/LayoutShell';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname === '/login') {
      document.body.className = '';
    } else {
      document.body.className = 'flex bg-gray-100';
    }
  }, [pathname]);
  
  // If it's the login page, render children without LayoutShell
  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  // For all other pages, render with LayoutShell
  return <LayoutShell>{children}</LayoutShell>;
}