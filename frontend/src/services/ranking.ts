import axios from "axios";
const baseUrl = "/api/play";
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
