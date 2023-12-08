import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          'text-slate-900 antialiased light min-h-screen pt-12 bg-slate-50'
        )}
      >
        <Navbar />
        <div className="container max-w-7xl h-full pt-12">{children}</div>
      </body>
    </html>
  );
}
