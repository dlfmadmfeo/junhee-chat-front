'use client';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';

export default function CafeHeader() {
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
    </>
  );
}
