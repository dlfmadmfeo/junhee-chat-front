'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeIcon } from '@heroicons/react/16/solid';
import { useCartStore } from '@/store/cartStore';
import type { MenuOption } from '@/app/types/menu';

type PayMethod = 'CARD' | 'KAKAO' | 'NAVER';

function formatKRW(v: number) {
  return v.toLocaleString();
}

function PayMethodLabel(method: PayMethod) {
  switch (method) {
    case 'CARD':
      return '카드결제';
    case 'KAKAO':
      return '카카오페이';
    case 'NAVER':
      return '네이버페이';
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, increment, decrement, clear } = useCartStore();

  const [payMethod, setPayMethod] = useState<PayMethod | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    // 목업: 할인/부가세가 필요하면 여기에서 계산 확장
    const discount = 0;
    const vat = 0; // 키오스크는 보통 '부가세 포함' 표기만 하고 별도 표시 안하는 경우도 많음
    const total = subtotal - discount + vat;
    return { subtotal, discount, vat, total };
  }, [items]);

  const canPay = items.length > 0 && payMethod !== null && !isPaying;

  const onClickPay = async () => {
    if (!canPay) return;

    setIsPaying(true);

    // ===== 목업 결제 흐름 =====
    // 1) 주문 생성 (서버 없이 목업)
    // 2) 결제 요청 (외부 PG 호출 대신 대기)
    await new Promise((r) => setTimeout(r, 900));

    // 성공 처리
    setIsPaying(false);
    setShowSuccess(true);

    // 키오스크 특성상 결제 성공 후 장바구니 비우고 홈으로 이동(또는 완료화면)
    setTimeout(() => {
      clear?.(); // clear가 없다면 아래 2) 참고
      router.push('/cafe/menu');
    }, 1200);
  };

  const onConfirmCancel = () => {
    // 주문 취소: 장바구니 비우고 홈 이동(키오스크 기본)
    clear?.();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Order list */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="font-bold">주문 내역</h2>
              <p className="text-sm text-gray-500 mt-1">상품과 옵션, 수량을 확인하세요.</p>
            </div>

            <div className="lg:max-h-[520px] lg:overflow-y-auto">
              {items.length === 0 ? (
                <div className="px-6 py-14 text-center text-gray-500">장바구니가 비어있습니다.</div>
              ) : (
                <ul className="divide-y">
                  {items.map((item, idx) => (
                    <li key={`${item.id}-${idx}`} className="px-4  py-4 flex flex-col  gap-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                      {/* item info */}
                      <div className="min-w-0">
                        <div className="font-semibold">{item.name}</div>

                        {/* options */}
                        {item.options && item.options.length > 0 && (
                          <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                            {item.options
                              .filter((opt: MenuOption) => opt.values?.length > 0)
                              .map((opt: MenuOption) => (
                                <li key={opt.label}>
                                  {opt.label}: <span className="font-medium text-gray-700">{opt.values.join(', ')}</span>
                                </li>
                              ))}
                          </ul>
                        )}

                        <div className="text-sm text-gray-500 mt-2">
                          {formatKRW(item.price)}원 × {formatKRW(item.quantity)}개
                        </div>

                        <div className="text-sm font-bold mt-1">{formatKRW(item.price * item.quantity)}원</div>
                      </div>

                      {/* controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-50"
                            onClick={() => decrement(item.id, item.options)}
                            aria-label="decrement"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-50"
                            onClick={() => increment(item.id, item.options)}
                            aria-label="increment"
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="w-10 h-10 flex items-center justify-center rounded-full border text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id, item.options)}
                          aria-label="remove"
                          title="삭제"
                        >
                          🗑
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-between items-center">
              <span className="text-sm text-gray-600">상품금액 합계</span>
              <span className="font-bold">{formatKRW(totals.subtotal)}원</span>
            </div>
          </div>
        </div>

        {/* Right: Payment */}
        <div className="col-span-12 lg:col-span-5 space-y-4 sm:space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="font-bold">결제 요약</h2>
            </div>

            <div className="px-6 py-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품금액</span>
                <span>{formatKRW(totals.subtotal)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">할인</span>
                <span>- {formatKRW(totals.discount)}원</span>
              </div>

              {/* 필요 시 부가세 노출 */}
              {/* <div className="flex justify-between">
                <span className="text-gray-600">부가세</span>
                <span>{formatKRW(totals.vat)}원</span>
              </div> */}

              <div className="pt-3 border-t flex justify-between items-center">
                <span className="font-bold">최종 결제금액</span>
                <span className="text-2xl font-extrabold">{formatKRW(totals.total)}원</span>
              </div>

              <p className="text-xs text-gray-500 pt-2">* 본 화면은 목업이며 실제 결제(PG) 연동은 수행하지 않습니다.</p>
            </div>
          </div>

          {/* Pay method */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="font-bold">결제 수단 선택</h2>
              <p className="text-sm text-gray-500 mt-1">카드/간편결제 중 하나를 선택하세요.</p>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 gap-3">
              {(['CARD', 'KAKAO', 'NAVER'] as PayMethod[]).map((m) => {
                const selected = payMethod === m;

                // 기본(미선택) + hover
                const baseStyle =
                  m === 'CARD'
                    ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                    : m === 'KAKAO'
                      ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                      : 'border-green-200 bg-green-50 hover:bg-green-100';

                // 선택 시 → 브랜드 본역 컬러
                const selectedStyle = m === 'CARD' ? 'border-blue-600 bg-blue-100' : m === 'KAKAO' ? 'border-[#FEE500] bg-[#FEE500]' : 'border-[#03C75A] bg-[#03C75A]';

                // 선택 시 텍스트 색 (본역 컬러 대비)
                const selectedText = m === 'KAKAO' ? 'text-black' : m === 'NAVER' ? 'text-black' : '';

                // 라디오 버튼
                const radioBorder = m === 'CARD' ? 'border-blue-600' : m === 'KAKAO' ? 'border-[#FEE500]' : 'border-[#03C75A]';

                const radioDot = m === 'CARD' ? 'bg-blue-600' : m === 'KAKAO' ? 'bg-[#FEE500]' : 'bg-[#03C75A]';

                return (
                  <button
                    key={m}
                    onClick={() => setPayMethod(m)}
                    className={`h-16 rounded-xl border flex items-center justify-between px-5 text-left transition
        ${baseStyle}
        ${selected ? `${selectedStyle} ${selectedText}` : ''}`}
                  >
                    <div>
                      <div className="font-bold">{PayMethodLabel(m)}</div>
                      <div className={`text-xs mt-1 text-gray-600`}>
                        {m === 'CARD' && '신용/체크카드 결제'}
                        {m === 'KAKAO' && '카카오페이'}
                        {m === 'NAVER' && '네이버페이'}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center
          ${selected ? radioBorder : 'border-gray-300'}`}
                    >
                      {selected && <div className={`w-3 h-3 rounded-full ${radioDot}`} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <button
              className={`w-full h-14 rounded-xl text-white font-bold text-lg transition
                ${canPay ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={!canPay}
              onClick={onClickPay}
            >
              {isPaying ? '결제 진행 중...' : payMethod ? `${PayMethodLabel(payMethod)}로 결제 진행` : '결제 수단을 선택하세요'}
            </button>

            <button className="w-full h-12 mt-3 rounded-xl border hover:bg-gray-50" onClick={() => router.back()}>
              장바구니로 돌아가기
            </button>
          </div>
        </div>
      </div>

      {/* Cancel confirm modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border">
            <div className="px-6 py-5 border-b">
              <div className="text-lg font-bold">주문을 취소할까요?</div>
              <div className="text-sm text-gray-500 mt-1">취소하면 장바구니가 비워지고 홈으로 이동합니다.</div>
            </div>
            <div className="px-6 py-5 flex gap-3">
              <button className="flex-1 h-12 rounded-xl border hover:bg-gray-50" onClick={() => setShowCancelConfirm(false)}>
                아니오
              </button>
              <button className="flex-1 h-12 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700" onClick={onConfirmCancel}>
                예, 취소할게요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border">
            <div className="px-6 py-8 text-center">
              <div className="text-2xl font-extrabold">결제 완료</div>
              <div className="text-sm text-gray-500 mt-2">{payMethod ? PayMethodLabel(payMethod) : ''} 결제가 완료되었습니다.</div>
              <div className="mt-6 text-lg font-bold">{formatKRW(totals.total)}원</div>
              <div className="text-xs text-gray-500 mt-3">잠시 후 홈으로 이동합니다.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
