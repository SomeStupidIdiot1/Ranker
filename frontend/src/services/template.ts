import { makeList } from "./../../../backend/src/routes/items/template.d";
import axios from "axios";

const baseUrl = "/api/template";

export const addTemplate = (makeList: makeList) => {
  return axios.post(`${baseUrl}/make_list`, makeList);
};
