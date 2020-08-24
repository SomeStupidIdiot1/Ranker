import axios from "axios";

const baseUrl = "/api";

export const login = async (email: string, password: string) => {
  try {
    return axios.post(`${baseUrl}/login`, { email, password });
  } catch (err) {
    console.log(err);
  }
};
export const register = async (
  username: string,
  email: string,
  password: string
) => {
  return axios.post(`${baseUrl}/register`, { username, email, password });
};
