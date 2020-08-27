import { getEmail } from "./../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
export default (baseUrl: string): Router => {
  const app = Router();

  app.post(`${baseUrl}/make_list`, async (req, res) => {
    const email = getEmail(req.get("authorization"));
    if (!email) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    const { title, info } = req.body;
    if (!title) {
      res.status(401).json({ err: "Missing title" });
      return;
    }
    ("INSERT INTO list_of_items(title, info, owner_id) VALUES($1, $2, $3) RETURNING owner_id");
    const client = await getClient();
    client.release();
  });
  return app;
};
