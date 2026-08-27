import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { ClientLayout } from './ClientLayout';

export const metadata: Metadata = {
  title: "SONIABALISHOP - Toko Online Fashion & Beauty Feminine",
  description:
    "Toko online fashion, beauty, dan lifestyle wanita dengan koleksi elegan, cute, dan modern.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FFF9F9] text-[#4A3A3A] font-sans antialiased selection:bg-[#FEBCBD] selection:text-[#4A3A3A]">
        <ToastProvider>
          <ClientLayout>{children}</ClientLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
