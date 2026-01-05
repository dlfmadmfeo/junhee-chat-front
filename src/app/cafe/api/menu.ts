export async function getMenuList() {
  const response = await fetch(`/menu/list`, { cache: 'no-store' });
  if (!response.ok) throw new Error('API 로드 실패');
  return response;
}
