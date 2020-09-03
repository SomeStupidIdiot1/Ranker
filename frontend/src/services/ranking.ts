import axios from "axios";
const baseUrl = "/api/play";

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
  return axios.get<RankItems>(`${baseUrl}/${templateId}`, {
    headers: {
      authorization: `bearer ${window.localStorage.getItem("login_token")}`,
    },
  });
};

export const rankItems = (
  templateId: string | number,
  wonId: string | number,
  lostId: string | number
) => {
  return axios.post<undefined>(
    `${baseUrl}/${templateId}`,
    {
      won: wonId,
      lost: lostId,
    },
    {
      headers: {
        authorization: `bearer ${window.localStorage.getItem("login_token")}`,
      },
    }
  );
};
