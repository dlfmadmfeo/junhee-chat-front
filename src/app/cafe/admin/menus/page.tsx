// app/admin/menus/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getMenuList, saveMenu, deleteMenu } from '@/app/utils/api'; // deleteMenu 추가 가정

type Menu = {
  id: number;
  menuCode: string;
  name: string;
  type: 'COFFEE' | 'DRINK' | 'FOOD'; // 확장 가능
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  eventStartDate?: string | null;
  eventEndDate?: string | null;
  optionList?: Array<any>;
  options?: Array<any>;
  isAvailable: boolean;
  isDeleted?: boolean;
  isEvent?: boolean;
  updatedDate?: string;
  updateDate?: string;
};

const fmtCurrency = (n: number | null | undefined) => (typeof n === 'number' ? `${n.toLocaleString()}원` : '-');

export default function AdminMenuList() {
  const qc = useQueryClient();
  const router = useRouter();

  // ✅ 목록은 "배열"로 수신한다고 가정 (가장 단순)
  const {
    data: rows = [],
    isLoading,
    isError,
  } = useQuery<Menu[]>({
    queryKey: ['menus'],
    queryFn: ({ signal }) => getMenuList(signal), // getMenuList가 signal 지원하도록
    staleTime: 0,
    retry: 1,
  });

  // ✅ 판매여부 토글 (낙관적 업데이트: 배열 기반)
  const toggleMutation = useMutation({
    mutationFn: async ({ id, next }: { id: number; next: boolean }) => {
      const target = rows.find((r) => r.id === id);
      if (!target) throw new Error('대상 메뉴를 찾을 수 없습니다.');

      // 백엔드가 partial PATCH를 지원하면 { id, isAvailable: next } 만 보내세요.
      // 현재 전체 스키마가 필요한 것으로 가정해 payload 구성
      return saveMenu({
        id: target.id,
        menuCode: target.menuCode ?? '',
        name: target.name ?? '',
        type: target.type ?? 'COFFEE',
        price: target.price ?? 0,
        imageUrl: target.imageUrl ?? '',
        description: target.description ?? '',
        eventStartDate: target.eventStartDate ?? null,
        eventEndDate: target.eventEndDate ?? null,
        optionList: target.optionList ?? target.options ?? [],
        isAvailable: next, // ← 토글 포인트
        isDeleted: target.isDeleted ?? false,
        isEvent: target.isEvent ?? false,
      });
    },
    onMutate: async ({ id, next }) => {
      await qc.cancelQueries({ queryKey: ['menus'] });
      const previous = qc.getQueryData<Menu[]>(['menus']);
      qc.setQueryData<Menu[]>(['menus'], (old) => (old ?? []).map((r) => (r.id === id ? { ...r, isAvailable: next } : r)));
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(['menus'], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['menus'] });
    },
  });

  // ✅ 삭제
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteMenu(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['menus'] });
      const previous = qc.getQueryData<Menu[]>(['menus']);
      qc.setQueryData<Menu[]>(['menus'], (old) => (old ?? []).filter((r) => r.id !== id));
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(['menus'], ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  });

  const openCreate = () => router.push('/admin/menus/new');
  const openEdit = (m: Menu) => router.push(`/admin/menus/${m.id}/edit`);
  const confirmDelete = (id: number) => {
    if (window.confirm('정말 삭제할까요?')) deleteMutation.mutate(id);
  };
  const toggleAvail = (id: number, next: boolean) => toggleMutation.mutate({ id, next });

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <button className="ml-auto h-10 px-4 rounded bg-black text-white" onClick={openCreate}>
          신규등록
        </button>
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 p-2">
                <input type="checkbox" aria-label="select all" />
              </th>
              <th className="w-14 p-2">이미지</th>
              <th className="p-2 text-left">메뉴명 / 코드</th>
              <th className="w-28 p-2 text-right">가격</th>
              <th className="w-28 p-2">상태</th>
              <th className="w-24 p-2">옵션수</th>
              <th className="w-36 p-2">업데이트</th>
              <th className="w-28 p-2">액션</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  불러오는 중…
                </td>
              </tr>
            )}

            {isError && !isLoading && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-red-600">
                  목록을 불러오지 못했어요. 새로고침 해주세요.
                </td>
              </tr>
            )}

            {!isLoading && !isError && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  메뉴가 없어요
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2 text-center">
                    <input type="checkbox" aria-label={`select ${r.name}`} />
                  </td>
                  <td className="p-2">
                    {r.imageUrl ? (
                      // Next/Image로 교체해도 됨
                      <img src={r.imageUrl} alt={r.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                    )}
                  </td>
                  <td className="p-2">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-gray-500 text-xs">{r.menuCode}</div>
                  </td>
                  <td className="p-2 text-right">{fmtCurrency(r.price)}</td>
                  <td className="p-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!r.isAvailable} onChange={(e) => toggleAvail(r.id, e.target.checked)} disabled={toggleMutation.isPending} />
                      <span className={`text-xs px-2 py-0.5 rounded ${r.isAvailable ? 'bg-green-100' : 'bg-gray-100'}`}>{r.isAvailable ? '판매중' : '숨김'}</span>
                    </label>
                  </td>
                  <td className="p-2 text-center">{r.options?.length ?? r.optionList?.length ?? 0}</td>
                  <td className="p-2 text-center">{new Date(r.updatedDate ?? r.updateDate ?? Date.now()).toLocaleDateString()}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 border rounded" onClick={() => openEdit(r)}>
                        수정
                      </button>
                      <button className="px-2 py-1 border rounded text-red-600" onClick={() => confirmDelete(r.id)} disabled={deleteMutation.isPending}>
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
