'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import menuList from '@/data/cartItems.json';
import { useParams, useRouter } from 'next/navigation';
import { CartItem } from '@/app/types/cart';
import Image from 'next/image';
import { useToastStore } from '@/store/toastStore';

export default function MenuDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { notify } = useToastStore();
  const menu = menuList.find((m) => m.id.toString() === id);
  const [temperature, setTemperature] = useState<'ICE' | 'HOT'>('ICE');
  const [syrup, setSyrup] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!menu) return <div>메뉴를 찾을 수 없습니다.</div>;

  const addItemHandler = (menu: CartItem) => {
    // notify('장바구니에 담았어요');
    addItem({
      ...menu,
      quantity: quantity,
    });
    router.push('/cafe/cart'); // 장바구니로 이동
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <button onClick={() => router.push('/cafe/menu')} className="p-4 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer text-md">
          🏠 처음으로
        </button>
      </div>

      <Image src={menu.imageUrl} alt={menu.name} width={1000} height={1000} priority className="w-full h-60 object-cover rounded" />
      <h1 className="text-2xl font-bold">{menu.name}</h1>
      <p className="text-gray-500">{menu.price.toLocaleString()} 원</p>

      {/* 옵션 선택 */}
      <div>
        <h2 className="font-semibold mb-2">온도 선택</h2>
        <div className="flex gap-4">
          <button onClick={() => setTemperature('ICE')} className={`px-4 py-2 rounded-lg border ${temperature === 'ICE' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
            ICE
          </button>
          <button onClick={() => setTemperature('HOT')} className={`px-4 py-2 rounded-lg border ${temperature === 'HOT' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>
            HOT
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">시럽 추가</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={syrup} onChange={(e) => setSyrup(e.target.checked)} />
          시럽 추가
        </label>
      </div>

      <div>
        <h2 className="font-semibold mb-2">수량</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-200 rounded">
            -
          </button>
          <span className="text-lg">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1 bg-gray-200 rounded">
            +
          </button>
        </div>
      </div>

      <div className="p-6 fixed bottom-0 left-0 right-0 bg-white">
        <button onClick={() => addItemHandler(menu)} className="w-full mt-3 py-3 bg-blue-500 text-white rounded-lg">
          담기
        </button>
      </div>
    </div>
  );
}
