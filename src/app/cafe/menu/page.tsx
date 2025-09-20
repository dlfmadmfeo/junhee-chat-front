'use client';
import { useCartStore } from '@/store/cartStore';
import menuList from '@/data/cartItems.json';
import { CartItem } from '@/app/types/cart';
import { useToastStore } from '@/store/toastStore';
import Link from 'next/link';

export default function MenuPage() {
  const { addItem, items } = useCartStore();
  const { notify } = useToastStore();

  const addItemHandler = (menu: CartItem) => {
    addItem({ ...menu, quantity: 1 });
    notify('장바구니에 담았어요');
  };

  return (
    <div className="p-6">
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {menuList.map((menu) => (
          <div key={menu.id} className="border rounded-lg p-3 shadow-sm hover:shadow-md transition">
            <img src={menu.imageUrl} alt={menu.name} className="w-full h-32 object-cover rounded" />
            <h2 className="mt-2 font-medium">{menu.name}</h2>
            <p className="text-gray-500">{menu.price.toLocaleString()} 원</p>
            <button onClick={() => addItemHandler(menu)} className="w-full mt-2 py-1 bg-blue-500 text-white rounded-lg">
              담기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
