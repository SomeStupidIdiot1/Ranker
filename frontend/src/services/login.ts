import {
  login as loginType,
  register as registerType,
} from "./../../../backend/src/routes/account/account.d";
import axios from "axios";

const baseUrl = "/api";

export const login = (login: loginType) => {
  return axios.post(`${baseUrl}/login`, login);
};
export const register = (register: registerType) => {
  return axios.post(`${baseUrl}/register`, register);
};
