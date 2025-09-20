'use client';

import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function CartDrawer() {
  const { items, removeItem, increment, decrement } = useCartStore();
  const totalCost = items.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString();

  return (
    <motion.div initial={{ y: 0 }} animate={{ y: 0 }} transition={{ duration: 0.3 }} className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl p-4">
      <h2 className="text-lg font-bold mb-4">장바구니</h2>

      <ul className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.li key={item.id} exit={{ opacity: 0, x: -20 }} className="flex justify-between items-center border-b py-3 hover:bg-gray-50 rounded">
              {/* 왼쪽: 썸네일 + 상품명 + 가격 */}
              <div className="flex items-center gap-3">
                {item.imageUrl && <Image src={item.imageUrl} className="w-12 h-12 object-cover rounded" alt={''} width={200} height={200} priority={i < 4} />}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{(item.price * item.quantity).toLocaleString()} 원</p>
                </div>
              </div>
              {/* 오른쪽: 수량조절 + 삭제 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100" onClick={() => decrement(item.id)}>
                    -
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100" onClick={() => increment(item.id)}>
                    +
                  </button>
                </div>
                <button className="text-red-500 text-xl hover:text-red-600" onClick={() => removeItem(item.id)}>
                  🗑
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* 총 금액 */}
      <div className="mt-4 flex justify-between items-center font-bold">
        <span>총 금액</span>
        <span>{totalCost} 원</span>
      </div>

      <button className="w-full mt-3 py-3 bg-blue-500 text-white rounded-lg">결제하기</button>
    </motion.div>
  );
}
