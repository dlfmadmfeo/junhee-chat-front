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
          const cartItem = state.items.find((i) => i.id === item.id);
          if (cartItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
            };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity }] };
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
