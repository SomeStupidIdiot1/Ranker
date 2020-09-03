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
  app.post(`${baseUrl}/:id`, async (req, res) => {
    const templateId = parseInt(req.params.id);
    let { won, lost } = req.body;
    won = parseInt(won);
    lost = parseInt(lost);
    const userId = getId(req.get("authorization"));
    if (!userId) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    if (isNaN(won) || isNaN(lost)) {
      res.status(400).end();
      return;
    }
    const client = await getClient();
    const wonRes = await client.query(
      "SELECT elo FROM item WHERE id=$1 AND owner_id=$2",
      [won, templateId]
    );
    const lostRes = await client.query(
      "SELECT elo FROM item WHERE id=$1 AND owner_id=$2",
      [won, templateId]
    );
    if (!wonRes.rowCount || !lostRes.rowCount) {
      res.status(400).json({ err: "Bad ids" });
    } else {
      const wonElo = wonRes.rows[0].elo;
      const lostElo = lostRes.rows[0].elo;
      const eloChangeFactor = 32;
      const expectedForWon = 1 / (1 + 10 ** ((lostElo - wonElo) / 400));
      const expectedForLost = 1 - expectedForWon;
      const newEloForWon = wonElo + eloChangeFactor * (1 - expectedForWon);
      const newEloForLost = lostElo + eloChangeFactor * -expectedForLost;
      client.query("UPDATE item SET elo=$1 WHERE id=$2", [newEloForWon, won]);
      client.query("UPDATE item SET elo=$1 WHERE id=$2", [newEloForLost, lost]);
    }
    client.release();
  });

  return app;
};
