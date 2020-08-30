import axios from "axios";

const baseUrl = "/api/template";

export interface NewTemplate {
  title: string;
  info?: string;
  imgStringBase64?: string;
}
export interface NewTemplateItem {
  titleOfTemplate: string;
  imgStringBase64: string[];
}
export type AllTemplates = {
  id: number;
  title: string;
  info: string;
  imageUrl: string | null;
  createdOn: Date;
  lastUpdated: Date;
}[];
export interface SpecificTemplate {
  title: string;
  info: string;
  templateImageUrl: string | null;
  createdOn: Date;
  lastUpdated: Date;
  items: {
    id: number;
    itemImageUrl: string;
    elo: number;
  }[];
}

export const addTemplate = (template: NewTemplate) => {
  return axios.post<undefined>(`${baseUrl}/make_list`, template, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
export const addItem = (templateItem: NewTemplateItem) => {
  return axios.post<undefined>(`${baseUrl}/make_item`, templateItem, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
export const getAllTemplates = () => {
  return axios.get<AllTemplates>(`${baseUrl}/get_list`, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
export const getSpecificTemplate = (id: number | string) => {
  return axios.get<SpecificTemplate>(`${baseUrl}/${id}`, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
