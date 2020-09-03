import axios from "axios";
const baseUrl = "/play";

export interface RankItems {
  item1: {
    id: string | number;
    imageName: string;
    imageUrl: string | null;
  };
  item2: {
    id: string | number;
    imageName: string;
    imageUrl: string | null;
  };
}
export const getRankingItems = (templateId: string | number) => {
  return axios.get<RankItems>(`${baseUrl}/${templateId}`);
};
