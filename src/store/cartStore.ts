import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuOption } from '@/app/types/cart';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, options: MenuOption[]) => void;
  clear: () => void;
  increment: (id: number, options: MenuOption[]) => void;
  decrement: (id: number, options: MenuOption[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const cartKey = buildCartKey(item.id, item.options);
          const existingIndex = state.items.findIndex((i) => buildCartKey(i.id, i.options) === cartKey);

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

      removeItem: (id, options) =>
        set((state) => {
          const cartKey = buildCartKey(id, options);
          return {
            items: state.items.filter((i) => buildCartKey(i.id, i.options) !== cartKey),
          };
        }),

      increment: (id, options) =>
        set((state) => {
          const cartKey = buildCartKey(id, options);
          return {
            items: state.items.map((i) => (buildCartKey(i.id, i.options) === cartKey ? { ...i, quantity: i.quantity + 1 } : i)),
          };
        }),

      decrement: (id, options) =>
        set((state) => {
          const cartKey = buildCartKey(id, options);
          return {
            items: state.items.map((i) => (buildCartKey(i.id, i.options) === cartKey ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i)),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: 'cart-storage' },
  ),
);

function buildCartKey(id: number, options: MenuOption[]): string {
  // 옵션 정규화 (순서 보장)
  const normalized = options
    .map((o) => `${o.name}:${o.values.sort().join(',')}`)
    .sort() // 옵션 name 순 정렬
    .join('|');

  return `${id}-${normalized}`;
}
