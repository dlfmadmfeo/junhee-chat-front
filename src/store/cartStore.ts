import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/app/types/cart';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          // 옵션 비교를 위해 JSON 문자열화
          const existingIndex = state.items.findIndex((i) => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options));

          if (existingIndex !== -1) {
            // 동일한 옵션의 같은 메뉴가 있으면 수량만 증가
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity,
            };
            return { items: updatedItems };
          }

          // 없으면 새로 추가
          return { items: [...state.items, { ...item }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      clear: () => set({ items: [] }),
      increment: (id) =>
        set((state) => {
          return {
            items: state.items.map((item) => {
              if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
              } else {
                return item;
              }
            }),
          };
        }),
      decrement: (id) =>
        set((state) => {
          return {
            items: state.items.map((item) => {
              if (item.id === id) {
                const quantity = item.quantity > 1 ? item.quantity - 1 : item.quantity;
                return { ...item, quantity: quantity };
              } else {
                return item;
              }
            }),
          };
        }),
    }),
    { name: 'cart-storage' },
  ),
);
