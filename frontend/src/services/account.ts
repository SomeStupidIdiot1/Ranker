import axios from "axios";
const baseUrl = "/api";

export interface Login {
  email: string;
  password: string;
}
export interface Register {
  email: string;
  password: string;
  username: string;
}
export interface LoginResult {
  username: string;
  userNum: number;
  email: string;
  token: string;
}
export const login = (login: Login) => {
  return axios.post<LoginResult>(`${baseUrl}/login`, login);
};
export const register = (register: Register) => {
  return axios.post<LoginResult>(`${baseUrl}/register`, register);
};
