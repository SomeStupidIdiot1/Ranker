import { getClient } from "../../db/database_config";
import { Router } from "express";
import jwt from "jsonwebtoken";
export default (baseUrl: string): Router => {
  const app = Router();

  app.post(`${baseUrl}/make_item`, async (req, res) => {
    const { email, password } = req.body;
    const client = await getClient();
    client.release();
  });
  return app;
};
