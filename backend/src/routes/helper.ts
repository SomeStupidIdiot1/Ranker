import { tokenContent as tokenType } from "./account/account.d";
import jwt from "jsonwebtoken";

export const getEmail = (auth: string | undefined): tokenType | null => {
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    const tokenContent = jwt.verify(
      token,
      process.env.SECRET_TOKEN_KEY as string
    ) as tokenType;
    if (!tokenContent) return null;
    return tokenContent;
  }
  return null;
};
