import api from '@/app/utils/axios';

export interface IResponse<T = any> {
  success: boolean;
  value: T;
  code: string;
  message: string;
}

export interface IUser {
  password: string;
  email: string;
}

export interface ISaveUser {
  name: string;
  password: string;
  email: string;
  phone: string;
}

export interface IMenuOptionValue {
  id: number;
  menuOptId: number;
  value: string;
  extraPrice: number;
}

export interface IMenuOption {
  name: string;
  label: string;
  type: 'SINGLE' | 'MULTIPLE';
  required: boolean;
  values: IMenuOptionValue[];
}

export interface ISaveMenu {
  id: number;
  menuCode: string;
  name: string;
  type: 'COFFEE' | 'DRINK' | 'FOOD'; // 확장 가능
  price: number;
  imageUrl: string;
  description: string;
  eventStartDate: string | null;
  eventEndDate: string | null;
  optionList: IMenuOption[];
  isAvailable: boolean;
  isDeleted: boolean;
  isEvent: boolean;
}

export const getUserList = () => {
  return api.get(`/user/list`);
};

export const userLogin = (params: IUser) => {
  return api.post(`/user/login`, { ...params });
};

export const saveUser = (params: ISaveUser) => {
  return api.post(`/user`, { ...params });
};

export const getMenuList = async (signal?: AbortSignal): Promise<any> => {
  const response: IResponse = await api.get('/menu/list');
  console.log('response: ', response.value);
  return response.value ?? [];
};

export const saveMenu = (params: ISaveMenu) => {
  return api.post(`/menu`, { ...params });
};

export const deleteMenu = (id: number) => {
  return api.delete(`/menu/${id}`);
};
