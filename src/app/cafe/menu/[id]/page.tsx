'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import menuList from '@/data/cartItems.json';
import { useParams, useRouter } from 'next/navigation';
import { CartItem, MenuOption } from '@/app/types/cart';
import Image from 'next/image';
import { useToastStore } from '@/store/toastStore';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function MenuDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { notify } = useToastStore();
  const menu: CartItem = menuList.find((m) => m.id.toString() === id) as CartItem;
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<Record<string, string[]>>({});

  if (!menu) return <div>메뉴를 찾을 수 없습니다.</div>;

  const addItemHandler = (menu: CartItem) => {
    const isValid = menu.options
      ?.filter((opt) => opt.required)
      .every((opt) => {
        const values: string[] = selectedOption[opt.name] || [];
        if (values.length === 0) {
          notify(`${opt.label}을(를) 선택해 주세요.`);
          return false;
        }
        return true;
      });
    if (!isValid) {
      return;
    }
    // notify('장바구니에 담았어요');
    addItem({
      ...menu,
      quantity: quantity,
      options: menu.options.map((opt: MenuOption) => {
        const values: string[] = selectedOption[opt.name] || [];
        return {
          ...opt,
          values: [...values],
        };
      }),
    });
    router.push('/cafe/cart'); // 장바구니로 이동
  };

  const changeOptionHandler = (option: MenuOption, value: string) => {
    if (option.type === 'SINGLE') {
      setSelectedOption((prev) => {
        return { ...prev, [option.name]: [value] };
      });
    } else if (option.type === 'MULTI') {
      setSelectedOption((prev) => {
        const currValues = prev?.[option.name] || [];
        const isExist = currValues.includes(value);
        return { ...prev, [option.name]: isExist ? currValues.filter((v) => v !== value) : [...currValues, value] };
      });
    }
  };

  return (
    <div className="">
      <div className="space-y-6">
        <Image src={menu.imageUrl || ''} alt={menu.name} width={500} height={500} priority className="w-full h-60 object-cover rounded" />
        <h1 className="text-2xl font-bold">{menu.name}</h1>
        <p className="text-gray-500">{menu.price.toLocaleString()} 원</p>

        {menu.options?.map((opt, i) => {
          return (
            <div key={opt.name}>
              <h2 className="font-semibold mb-2">{opt.label}</h2>
              <div className="flex gap-4">
                {opt.values.map((val) => {
                  const isSelected = selectedOption?.[opt.name]?.includes(val);
                  return (
                    <button
                      key={val}
                      onClick={() => changeOptionHandler(opt, val)}
                      className={`px-4 py-2 rounded-lg border ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 border-gray-300'}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="p-6 fixed bottom-0 left-0 right-0 bg-white">
          <button onClick={() => addItemHandler(menu)} className="w-full mt-3 py-3 bg-blue-500 text-white rounded-lg">
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
