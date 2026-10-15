import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  description:
    'Hyperse Wizard is a modern, type-safe CLI framework core library that provides powerful command-line tool building capabilities.',
  metadataBase: new URL('https://www.hyperse.net/'),
  keywords: [
    'Hyperse',
    'Wizard',
    'CLI',
    'Framework',
    'TypeScript',
    'JavaScript',
  ],
  generator: 'Hyperse',
  applicationName: 'Hyperse Wizard',
  appleWebApp: {
    title: 'Hyperse Wizard',
  },
  title: {
    default: 'Hyperse Wizard – Hyperse Wizard',
    template: '%s | Hyperse Wizard',
  },
  openGraph: {
    url: './',
    siteName: 'Hyperse Wizard',
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'msapplication-TileColor': '#fff',
  },
  twitter: {
    site: 'https://www.hyperse.net/',
  },
  alternates: {
    canonical: './',
  },
};

const RootLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/wizard/favicon.svg"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          search={{ options: { type: 'static', api: '/api/search' } }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
