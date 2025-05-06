import api from "@/app/utils/axios";

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

export const getUserList = () => {
  return api.get(`/user/list`);
};

export const userLogin = (params: IUser) => {
  return api.post(`/user/login`, { ...params });
};

export const saveUser = (params: ISaveUser) => {
  return api.post(`/user`, { ...params });
};
