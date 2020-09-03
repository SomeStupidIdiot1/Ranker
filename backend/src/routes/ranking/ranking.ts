import { getId } from "./../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
export default (baseUrl: string): Router => {
  const app = Router();

  app.get(`${baseUrl}/:id`, async (req, res) => {
    const templateId = parseInt(req.params.id);
    const userId = getId(req.get("authorization"));
    if (!userId) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    const client = await getClient();
    const queryRes = await client.query(
      "SELECT id, image_name, image_url FROM item WHERE owner_id=$1",
      [templateId]
    );
    if (queryRes.rowCount <= 1)
      res.send(400).json({ err: "Not enough items to play" });
    else {
      const firstItemIndex = ~~(Math.random() * queryRes.rowCount);
      let secondItemIndex = ~~(Math.random() * queryRes.rowCount);
      while (firstItemIndex === secondItemIndex)
        secondItemIndex = ~~(Math.random() * queryRes.rowCount);
      res.json({
        item1: {
          id: queryRes.rows[firstItemIndex].id,
          imageName: queryRes.rows[firstItemIndex].image_name,
          imageUrl: queryRes.rows[firstItemIndex].image_url,
        },
        item2: {
          id: queryRes.rows[secondItemIndex].id,
          imageName: queryRes.rows[secondItemIndex].image_name,
          imageUrl: queryRes.rows[secondItemIndex].image_url,
        },
      });
    }
    client.release();
  });

  return app;
};
