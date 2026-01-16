import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SeuInstrutor - Admin',
  description: 'Painel Administrativo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
