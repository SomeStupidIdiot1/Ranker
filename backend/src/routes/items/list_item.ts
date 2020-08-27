import { getEmail } from "./../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
export default (baseUrl: string): Router => {
  const app = Router();

  // app.post(`${baseUrl}/make_item`, async (req, res) => {});
  return app;
};
