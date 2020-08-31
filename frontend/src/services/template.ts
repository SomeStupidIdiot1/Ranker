import axios from "axios";

const baseUrl = "/api/template";

export interface NewTemplate {
  title: string;
  info?: string;
  imgStringBase64?: string;
}
export interface NewTemplateItem {
  id: string | number;
  images: { imgStringBase64?: string; name: string }[];
}
export type AllTemplates = {
  id: number;
  title: string;
  info: string;
  imageUrl: string | null;
  createdOn: string;
  lastUpdated: string;
}[];
export interface SpecificTemplate {
  title: string;
  info: string;
  templateImageUrl: string | null;
  createdOn: string;
  lastUpdated: string;
  items: {
    id: number;
    itemImageUrl: string | null;
    elo: number;
    imageId: string | null;
    name: string;
  }[];
}
export interface AddTemplateResult {
  id: string | number;
}

export const addTemplate = (template: NewTemplate) => {
  return axios.post<AddTemplateResult>(baseUrl, template, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
export const addItem = (templateItem: NewTemplateItem) => {
  return axios.post<undefined>(
    `${baseUrl}/${templateItem.id}`,
    { images: templateItem.images },
    {
      headers: {
        authorization: `bearer ${window.localStorage.getItem("login_token")}`,
      },
    }
  );
};
export const getAllTemplates = () => {
  return axios.get<AllTemplates>(baseUrl, {
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
export const deleteTemplate = (id: number | string) => {
  return axios.delete<undefined>(`${baseUrl}/${id}`, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};
