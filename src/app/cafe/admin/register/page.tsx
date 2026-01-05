'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MenuType, MenuOption, Menu } from '@/app/types/menu';

// ---------------- Mock API (실제로는 Spring으로 교체) ----------------
async function apiList(): Promise<Menu[]> {
  return [
    {
      id: 1,
      name: '아메리카노',
      type: 'COFFEE',
      price: 3000,
      imageUrl: 'https://images.unsplash.com/photo-1494314671902-399b18174975?q=80&w=1200&auto=format&fit=crop',
      description: '기본 아메리카노',
      isAvailable: true,
      options: [{ name: 'size', label: '사이즈', type: 'SINGLE', values: ['레귤러', '라지'], required: true }],
      menuCode: '',
      quantity: 0,
    },
  ];
}
async function apiCreate(data: Menu): Promise<{ id: number }> {
  console.log('CREATE', data);
  return { id: Math.floor(Math.random() * 10_000) };
}
async function apiUpdate(id: number, data: Menu): Promise<void> {
  console.log('UPDATE', id, data);
}
async function apiDelete(id: number): Promise<void> {
  console.log('DELETE', id);
}

// ---------------- Page ----------------
export default function Register() {
  const [items, setItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<MenuType | 'ALL'>('ALL');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await apiList();
      setItems(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const okQ = q ? it.name.toLowerCase().includes(q.toLowerCase()) : true;
      const okC = cat === 'ALL' ? true : it.type === cat;
      return okQ && okC;
    });
  }, [items, q, cat]);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(row: Menu) {
    setEditing(row);
    setOpen(true);
  }
  async function onDelete(id?: number) {
    if (!id) return;
    if (!confirm('정말 삭제할까요?')) return;
    await apiDelete(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">관리자 · 메뉴 관리</h1>
        <div className="flex items-center gap-2">
          <input className="w-56 border rounded-md h-10 px-3" placeholder="검색: 메뉴명" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="border h-10 rounded-md px-3" value={cat} onChange={(e) => setCat(e.target.value as MenuType | 'ALL')}>
            <option value="ALL">전체</option>
            <option value="COFFEE">커피</option>
            <option value="DRINK">음료</option>
            <option value="DESSERT">디저트</option>
          </select>
          <button onClick={openCreate} className="h-10 px-4 rounded-2xl bg-black text-white">
            신규등록
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {loading ? (
        <div className="text-sm text-gray-500">불러오는 중…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-2xl border shadow-sm">
                <div className="p-4 flex items-center justify-between">
                  <div className="text-lg font-semibold">{m.name}</div>
                  <div className="flex gap-2">
                    <button className="border rounded-md px-2 py-1" onClick={() => openEdit(m)}>
                      수정
                    </button>
                    <button className="border rounded-md px-2 py-1 text-red-600" onClick={() => onDelete(m.id)}>
                      삭제
                    </button>
                  </div>
                </div>
                <div className="p-4 pt-0 space-y-2">
                  {m.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.imageUrl} alt={m.name} className="w-full h-36 object-cover rounded-xl" />
                  )}
                  <div className="text-sm text-gray-500">{m.description}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 rounded bg-gray-100">{m.type}</span>
                    <span className={`px-2 py-0.5 rounded ${m.isAvailable ? 'bg-green-100' : 'bg-gray-100'}`}>{m.isAvailable ? '판매중' : '숨김'}</span>
                  </div>
                  <div className="font-semibold">{m.price.toLocaleString()} 원</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {open && (
        <EditModal
          initial={editing || undefined}
          onClose={() => setOpen(false)}
          onSaved={(saved, mode) => {
            setOpen(false);
            if (mode === 'create') setItems((prev) => [saved, ...prev]);
            else setItems((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
          }}
        />
      )}
    </div>
  );
}

function EditModal({ initial, onClose, onSaved }: { initial?: Menu; onClose: () => void; onSaved: (m: Menu, mode: 'create' | 'edit') => void }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<Menu>(
    initial ?? {
      name: '',
      type: 'COFFEE',
      price: 0,
      imageUrl: '',
      description: '',
      isAvailable: true,
      options: [],
      menuCode: '',
      quantity: 0,
      id: 0,
    },
  );
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  function set<K extends keyof Menu>(key: K, value: Menu[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string | undefined> = {};
    if (!form.name?.trim()) e.name = '메뉴명을 입력하세요';
    if (!form.type) e.type = '카테고리를 선택하세요';
    if (form.price < 0 || Number.isNaN(form.price)) e.price = '가격을 올바르게 입력';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save() {
    if (!validate()) return;
    if (!isEdit) {
      const res = await apiCreate(form);
      onSaved({ ...form, id: res.id }, 'create');
    } else {
      await apiUpdate(initial!.id!, form);
      onSaved({ ...form, id: initial!.id }, 'edit');
    }
  }

  function addOption() {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { name: 'size', label: '사이즈', type: 'SINGLE', values: ['기본'], required: false }],
    }));
  }

  function updateOption(idx: number, patch: Partial<MenuOption>) {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((op, i) => (i === idx ? { ...op, ...patch } : op)),
    }));
  }

  function deleteOption(idx: number) {
    setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  }

  function addValue(idx: number) {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((op, i) => (i === idx ? { ...op, values: [...op.values, ''] } : op)),
    }));
  }

  function updateValue(idx: number, vidx: number, value: string) {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((op, i) => (i === idx ? { ...op, values: op.values.map((v, j) => (j === vidx ? value : v)) } : op)),
    }));
  }

  function deleteValue(idx: number, vidx: number) {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((op, i) => (i === idx ? { ...op, values: op.values.filter((_, j) => j !== vidx) } : op)),
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{isEdit ? '메뉴 수정' : '메뉴 신규등록'}</h2>
          <button onClick={onClose} className="text-gray-500">
            닫기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">메뉴명</label>
            <input className="w-full border rounded-md h-10 px-3" value={form.name} onChange={(e) => set('name', e.target.value)} />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">카테고리</label>
            <select className="w-full border rounded-md h-10 px-3" value={form.type} onChange={(e) => set('type', e.target.value as MenuType)}>
              <option value="COFFEE">커피</option>
              <option value="DRINK">음료</option>
              <option value="DESSERT">디저트</option>
            </select>
            {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">가격(원)</label>
            <input type="number" min={0} step={100} className="w-full border rounded-md h-10 px-3" value={form.price} onChange={(e) => set('price', Number(e.target.value))} />
            {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">이미지 URL</label>
            <input className="w-full border rounded-md h-10 px-3" placeholder="https://..." value={form.imageUrl || ''} onChange={(e) => set('imageUrl', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">설명</label>
            <textarea rows={3} className="w-full border rounded-md px-3 py-2" value={form.description || ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.isAvailable} onChange={(e) => set('isAvailable', e.target.checked)} />
            <span className="text-sm">판매중(노출)</span>
          </label>
        </div>

        <div className="h-px bg-gray-200 my-6" />

        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">옵션</h3>
          <button type="button" className="border rounded-md px-3 h-9" onClick={addOption}>
            옵션 추가
          </button>
        </div>
        {form.options.length === 0 && <p className="text-sm text-gray-500">옵션이 없는 메뉴라면 비워두세요.</p>}
        <div className="space-y-4">
          {form.options.map((op, idx) => (
            <div key={idx} className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">옵션 #{idx + 1}</div>
                <button className="text-red-600" onClick={() => deleteOption(idx)}>
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-sm">name</label>
                  <input className="w-full border rounded-md h-10 px-3" value={op.name} onChange={(e) => updateOption(idx, { name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm">label</label>
                  <input className="w-full border rounded-md h-10 px-3" value={op.label} onChange={(e) => updateOption(idx, { label: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm">선택 방식</label>
                  <select className="w-full border rounded-md h-10 px-3" value={op.type} onChange={(e) => updateOption(idx, { type: e.target.value as MenuOption['type'] })}>
                    <option value="SINGLE">단일선택</option>
                    <option value="MULTI">다중선택</option>
                  </select>
                </div>
                <label className="flex items-end gap-2">
                  <input type="checkbox" checked={!!op.required} onChange={(e) => updateOption(idx, { required: e.target.checked })} />
                  <span className="text-sm">필수</span>
                </label>
              </div>

              {/* values builder */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">값 목록</div>
                  <button className="border rounded-md px-3 h-8" onClick={() => addValue(idx)} type="button">
                    값 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {op.values.map((v, j) => (
                    <div key={j} className="grid grid-cols-[1fr_40px] gap-2">
                      <input className="border rounded-md h-10 px-3" value={v} onChange={(e) => updateValue(idx, j, e.target.value)} />
                      <button className="text-red-600" onClick={() => deleteValue(idx, j)} type="button">
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button className="border rounded-md h-10 px-4" onClick={onClose}>
            취소
          </button>
          <button className="h-10 px-5 rounded-md bg-black text-white" onClick={save}>
            {isEdit ? '저장' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
