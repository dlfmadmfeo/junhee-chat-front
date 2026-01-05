import { Metadata } from 'next';
import CafeHeader from './CafeHeader';
import UserLayout from './(user)/layout';
import AdminLayout from './admin/layout';

type Role = 'ADMIN' | 'USER';

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
  const role: Role = 'USER';
  return (
    <>
      <CafeHeader />
      <div className="p-6">{role === 'USER' ? <UserLayout>{children}</UserLayout> : <AdminLayout>{children}</AdminLayout>}</div>
    </>
  );
}
