import { Router } from "express";
import list from "./list";
import listItem from "./list_item";
export default (baseUrl: string): Router => {
  const app = Router();
  app.use(list(`${baseUrl}/template`));
  app.use(listItem(`${baseUrl}/template`));
  return app;
};
