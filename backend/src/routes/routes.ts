import { getClient } from "./../db/database_config";
import { Router } from "express";
import account from "./account/account";
import items from "./items/template";
export default (baseUrl: string): Router => {
  const app = Router();

  app.get(baseUrl, async (_, res) => {
    const client = await getClient();
    const queryRes = await client.query("SELECT NOW()");
    res.send(queryRes.rows[0].now);
    client.release();
  });
  app.use(account(baseUrl));
  app.use(items(baseUrl));
  return app;
};
