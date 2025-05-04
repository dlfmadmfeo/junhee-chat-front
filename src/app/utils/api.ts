import api from "@/app/utils/axios";

export interface IUser {
  password: string;
  email: string;
}

export const getUserList = () => {
  return api.get(`/user/list`);
};

export const userLogin = (params: IUser) => {
  return api.post(`/user/login`, { ...params });
};
