import { Router } from "express";
export default (baseUrl: string): Router => {
  const app = Router();

  app.get(baseUrl, (_, res) => {
    res.send("API PAGE");
  });

  app.post(`${baseUrl}/login`, (_, res) => {
    res.send("API PAGE");
  });
  app.post(`${baseUrl}/register`, (_, res) => {
    res.send("API PAGE");
  });
  return app;
};
