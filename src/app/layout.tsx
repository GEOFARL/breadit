import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
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
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          'text-slate-900 antialiased light min-h-screen pt-12 bg-slate-50'
        )}
      >
        <Providers>
          <Navbar />

          {authModal}

          <div className="container max-w-7xl h-full pt-12">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
