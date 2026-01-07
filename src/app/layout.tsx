import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/header';
import { getAuthUser } from '@/lib/auth';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FDK',
  description: 'Gerenciador de partidas',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();

  return (
    <html lang="en" className="flex min-h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col flex-1 `}
      >
        <Header
          user={
            user
              ? {
                  name: user.nome,
                  image: user.fotoBase64,
                  role: user.role,
                }
              : null
          }
        />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'mt-4',
          }}
        />
      </body>
    </html>
  );
}
