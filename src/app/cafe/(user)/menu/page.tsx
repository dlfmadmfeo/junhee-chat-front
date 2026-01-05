'use client';
import { useCartStore } from '@/store/cartStore';
import menuList from '@/data/menuList.json';
import { Menu, MenuType } from '@/app/types/menu';
import { useToastStore } from '@/store/toastStore';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const { addItem, items } = useCartStore();
  const { notify } = useToastStore();
  const [activeType, setActiveType] = useState<MenuType>('COFFEE');
  const router = useRouter();

  const tabList: { type: MenuType; label: string }[] = [
    { type: 'COFFEE', label: '커피' },
    { type: 'DRINK', label: '음료' },
    { type: 'DESSERT', label: '디저트' },
    { type: 'ALL', label: '전체' },
  ];

  const addItemHandler = (menu: Menu) => {
    addItem({ ...menu, quantity: 1 });
    notify('장바구니에 담았어요');
  };

  return (
    <div className="">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">메뉴판</h1>
        {/* 장바구니 */}
        <Link href={'/cafe/cart'} className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-7 h-7 fill-current text-gray-800">
            <path
              d="M0 24C0 10.7 10.7 0 24 0H69.5c22.1 0 
             41.5 15.2 46.6 36.7L128.5 96H552c13.3 
             0 24 10.7 24 24c0 2.7-.5 5.4-1.4 
             7.9l-72 192c-7.3 19.4-25.9 
             32.1-46.6 32.1H183.5l5.4 24H520c13.3 
             0 24 10.7 24 24s-10.7 24-24 
             24H160c-11.1 0-20.6-7.6-23.1-18.4l-63-280H24C10.7 
             128 0 117.3 0 104V24zM128 
             464a48 48 0 1 1 96 0 48 48 0 1 1-96 
             0zm288 0a48 48 0 1 1 96 0 48 48 0 1 
             1-96 0z"
            />
          </svg>
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{items.length}</span>
        </Link>
      </div>
      <motion.div className="flex gap-6 border-b border-gray-200 mb-6 relative">
        {tabList.map((obj) => (
          <button
            key={obj.type}
            onClick={() => setActiveType(obj.type)}
            className={`flex-1 relative pb-2 text-sm font-medium transition-colors ${activeType === obj.type ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}
      `}
          >
            {obj.label}
            {activeType === obj.type && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded" />}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {menuList
          .filter((menu) => (activeType === 'ALL' ? true : menu.type === activeType))
          .map((menu, i) => (
            <div key={menu.id} className="group border rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => router.push(`/cafe/menu/${menu.id}`)}>
              <Image src={menu.imageUrl} alt={menu.name} className="w-full h-32 object-cover rounded group-hover:scale-105" width={200} height={200} priority={i < 4} />
              <h2 className="mt-2 font-medium">{menu.name}</h2>
              <p className="text-gray-500">{menu.price.toLocaleString()} 원</p>
              {/* <button onClick={() => addItemHandler(menu)} className="w-full mt-2 py-1 bg-blue-500 text-white rounded-lg">
                담기
              </button> */}
            </div>
          ))}
      </div>
    </div>
  );
}
