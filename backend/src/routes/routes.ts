import { getClient } from "./../db/database_config";
import { Router } from "express";
export default (baseUrl: string): Router => {
  const app = Router();

  app.get(baseUrl, async (_, res) => {
    const client = await getClient();
    const queryRes = await client.query("SELECT NOW()");
    res.send(queryRes.rows[0].now);
    client.release();
  });

  app.post(`${baseUrl}/login`, (_, res) => {
    res.send("API PAGE");
  });
  app.post(`${baseUrl}/register`, (_, res) => {
    res.send("API PAGE");
  });
  return app;
};
