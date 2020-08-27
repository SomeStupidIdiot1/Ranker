import { tokenContent } from "./account/account.d";
import jwt from "jsonwebtoken";

export const getEmail = (auth: string | undefined): string | null => {
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    const tokenContent = jwt.verify(
      token,
      process.env.SECRET as string
    ) as tokenContent;
    if (!token || !tokenContent.email) return null;
    return tokenContent.email;
  }
  return null;
};
