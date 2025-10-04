'use client';

import { useEffect, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';

export default function NetworkBanner() {
  const [status, setStatus] = useState<'online' | 'offline' | null>(null);

  useEffect(() => {
    // 마운트 시 현재 상태 반영
    setStatus(onlineManager.isOnline() ? null : 'offline');

    // 온라인/오프라인 전환 구독
    return onlineManager.subscribe(() => {
      if (onlineManager.isOnline()) {
        setStatus('online');
        setTimeout(() => {
          setStatus(null);
        }, 3000);
      } else {
        setStatus('offline');
      }
    });
  }, []);

  // 온라인이면 배너 표시 안 함 (오프라인일 때만 표시, 자동으로 사라지지 않음)
  if (status == null) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 inset-x-0 z-[1000] w-full text-center justify-center px-3 py-3 flex items-center
         shadow-md text-white ${status === 'online' ? 'bg-green-600' : 'bg-red-500'}`}
    >
      {status === 'offline' ? <span>네트워크 연결이 끊겼습니다. 일부 기능이 동작하지 않을 수 있어요.</span> : <span>네트워크가 다시 연결되었습니다.</span>}
    </div>
  );
}
