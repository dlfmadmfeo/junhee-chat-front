'use client';

import { useState } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const [loading, setLoading] = useState<boolean>(false);
  const retry = () => {
    setLoading(true);
    setTimeout(() => {
      reset();
      setLoading(false);
    }, 300);
  };
  return (
    <>
      <div className="flex justify-center items-center flex-col min-h-screen">
        <div className="text-2xl font-bold mb-2">에러가 발생했어요.</div>
        <p className="text-gray-400 mb-4">에러메시지: {error.message}</p>
        <button onClick={retry} className={`${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}   py-2 px-4 text-white rounded`} disabled={loading}>
          다시시도
        </button>
      </div>
    </>
  );
}
