import jwt from "jsonwebtoken";

export const getEmail = (auth: string | undefined): string | null => {
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    if (!token) return null;
    try {
      return jwt.verify(
        token,
        process.env.SECRET_TOKEN_KEY as string
      ) as string;
    } catch (err) {
      return null;
    }
  }
  return null;
};
