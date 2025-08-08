'use client';

import { useState, ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import clsx from 'clsx';

interface LayoutShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function LayoutShell({ children, title }: LayoutShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileOpen}
        isCollapsed={isCollapsed}
        closeSidebar={closeMobile}
      />

      {/* Mobile dimmer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Main column */}
      <div
        className={clsx(
          'flex flex-col flex-1 min-h-screen transition-all duration-300',
          {
            'md:ml-[60px]': isCollapsed,
            'md:ml-[250px]': !isCollapsed,
          }
        )}
      >
        <Topbar
          sidebarOpen={mobileOpen}
          toggleSidebar={toggleMobile}
          toggleCollapse={toggleCollapse}
          isCollapsed={isCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </>
  );
}

export {};
