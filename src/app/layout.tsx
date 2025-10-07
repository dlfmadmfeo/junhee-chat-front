import './globals.css';
import Head from 'next/head';
import Toast from '@/components/Toast';
import { Metadata } from 'next';
import NetworkBanner from '@/components/NetworkBanner';
import ReactQueryProvider from './providers/ReactQueryProvider';

export const metadata: Metadata = {
  title: '채팅앱/카페앱',
  description: '채팅앱과 카페앱을 개발하는 사이트입니다.',
  keywords: ['junhee chat', 'junhee cafe'],
  authors: [{ name: '조준희' }, { name: 'junhee92kr' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Head>
        <meta name="author" content="조준희" />
        <meta name="keywords" content="ChatApp, 채팅, 실시간" />
      </Head>
      <body>
        <ReactQueryProvider>
          {children} <Toast />
          <NetworkBanner />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
