import axios from "axios";

const baseUrl = "/api";

export const login = (email: string, password: string) => {
  return axios.post(`${baseUrl}/login`, { email, password });
};
export const register = (username: string, email: string, password: string) => {
  return axios.post(`${baseUrl}/register`, { username, email, password });
};
