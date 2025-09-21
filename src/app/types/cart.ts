export type MenuType = 'ALL' | 'COFFEE' | 'DRINK' | 'DESERT';

export type MenuOption = {
  name: string;
  label: string;
  type: 'SINGLE' | 'MULTI';
  values: string[];
  required?: boolean;
};

export interface CartItem {
  id: number; // 상품 고유 ID
  name: string; // 상품명
  type: string | MenuType; // 종류
  price: number; // 가격
  quantity: number; // 개수
  imageUrl?: string;
  options: MenuOption[];
}
