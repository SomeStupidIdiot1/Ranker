import {
  makeList as makeListType,
  makeItem as makeItemType,
} from "./../../../backend/src/routes/items/template.d";
import axios from "axios";

const baseUrl = "/api/template";

export const addTemplate = (makeList: makeListType) => {
  return axios.post(`${baseUrl}/make_list`, makeList, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
export const addItem = (makeItem: makeItemType) => {
  return axios.post(`${baseUrl}/make_item`, makeItem, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
export const getTemplate = () => {
  return axios.get(`${baseUrl}/get_list`, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
export const getSpecificTemplate = (id: number | string) => {
  return axios.get(`${baseUrl}/${id}`, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
