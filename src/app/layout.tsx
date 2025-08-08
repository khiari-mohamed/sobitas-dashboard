import './globals.css';
import type { ReactNode } from 'react';
import LayoutShell from '@/components/LayoutShell';

export const metadata = {
  title: 'Protein Admin',
  description: 'Dashboard Sobitas',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex bg-gray-100">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
