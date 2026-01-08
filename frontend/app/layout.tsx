import { ReactNode } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>CareerSync AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-Powered Career Intelligence Platform" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
