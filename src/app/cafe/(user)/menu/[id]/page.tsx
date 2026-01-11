'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import menuList from '@/data/menuList.json';
import { useParams, useRouter } from 'next/navigation';
import { Menu, MenuOption } from '@/app/types/menu';
import Image from 'next/image';
import { useToastStore } from '@/store/toastStore';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function MenuDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { notify } = useToastStore();
  const menu: Menu = menuList.find((m) => m.id.toString() === id) as Menu;
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<Record<string, string[]>>({});

  if (!menu) return <div>메뉴를 찾을 수 없습니다.</div>;

  const addItemHandler = (menu: Menu) => {
    const isValid =
      menu.options && menu.options.length > 0
        ? menu.options
            .filter((opt) => opt.required)
            .every((opt) => {
              const values = selectedOption[opt.name] || [];
              if (values.length === 0) {
                notify(`${opt.label}을(를) 선택해 주세요.`);
                return false;
              }
              return true;
            })
        : true; // 옵션이 없으면 항상 유효

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

    notify(`장바구니에 ${menu.name}을(를) 담았습니다.`);
    router.push('/cafe/menu'); // 장바구니로 이동
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
    <div className="pb-32">
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
                      className={`px-4 py-2 rounded-lg border ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 border-gray-300 hover:bg-blue-200'}`}
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
          <button
            onClick={() => {
              alert('testing...');
              addItemHandler(menu);
            }}
            className="w-full mt-3 py-3 bg-blue-500 text-white rounded-lg"
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
