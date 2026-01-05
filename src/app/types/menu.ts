export type MenuType = 'ALL' | 'COFFEE' | 'DRINK' | 'DESSERT';

export type MenuOption = {
  name: string;
  label: string;
  type: 'SINGLE' | 'MULTI';
  values: string[];
  required?: boolean;
};

export interface Menu {
  id: number; // 상품 고유 ID
  menuCode: string;
  name: string; // 상품명
  type: string | MenuType; // 종류
  price: number; // 가격
  quantity: number; // 개수
  imageUrl?: string;
  options: MenuOption[];
  description?: string | null;
  isAvailable?: boolean; // 기본값 true
  isDeleted?: boolean; // 기본값 false
  isEvent?: boolean; // 기본값 false
  eventStartDate?: string | null; // ISO (nullable)
  eventEndDate?: string | null;
}
