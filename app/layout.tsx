import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrapLawPro — Attorney Portal',
  description: 'SoundExchange featured-performer filing portal for music-rights attorneys.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
