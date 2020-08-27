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
      res.status(400).json({ err: "Missing title" });
      return;
    }

    const client = await getClient();
    client
      .query(
        "INSERT INTO list_of_items(title, info, owner_id) VALUES($1, $2, (SELECT id FROM accounts WHERE email=$3))",
        [title, info || "", email]
      )
      .then(() => res.end())
      .catch(() => res.status(400).json({ err: "Title already exists" }));
    client.release();
  });
  return app;
};
