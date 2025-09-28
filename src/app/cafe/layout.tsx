import { Metadata } from 'next';
import CafeHeader from './CafeHeader';

export const metadata: Metadata = {
  title: '준희의 카페',
  description: '카페 메뉴를 선택하여 장바구니에 담고 결제할 수 있는 앱입니다.',
  keywords: ['junhee cafe'],
  authors: [{ name: '조준희' }, { name: 'junhee92kr' }],
};

export default function CafeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CafeHeader />
      <div className="p-6">{children}</div>
    </>
  );
}
