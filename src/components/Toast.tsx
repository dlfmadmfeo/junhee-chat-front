'use client';

import { useToastStore } from '@/store/toastStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast() {
  const { show, message } = useToastStore();
  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
