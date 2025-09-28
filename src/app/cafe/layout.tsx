'use client';
import { HomeIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const path = usePathname();

  return (
    <>
      {path !== '/cafe/menu' && (
        <div>
          <div className="pl-6 pt-6">
            <button onClick={() => router.push('/cafe/menu')} className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 cursor-pointer text-md shadow">
              <HomeIcon className="w-8 h-8 text-gray-700" />
              <span className="text-xl font-semibold">홈</span>
            </button>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </>
  );
}
