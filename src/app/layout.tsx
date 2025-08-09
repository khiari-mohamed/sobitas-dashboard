import './globals.css';
import type { ReactNode } from 'react';
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata = {
  title: 'Protein Admin',
  description: 'Dashboard Sobitas',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
