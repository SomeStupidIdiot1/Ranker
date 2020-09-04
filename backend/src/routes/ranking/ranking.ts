import { getId } from "./../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
export default (baseUrl: string): Router => {
  const app = Router();

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
      [lost, templateId]
    );
    if (!wonRes.rowCount || !lostRes.rowCount) {
      res.status(400).json({ err: "Bad ids" });
    } else {
      const wonElo = wonRes.rows[0].elo;
      const lostElo = lostRes.rows[0].elo;
      const eloChangeFactor = 32;
      const expectedForWon = 1 / (1 + 10 ** ((lostElo - wonElo) / 400));
      const newEloForWon = wonElo + eloChangeFactor * (1 - expectedForWon);
      const newEloForLost = lostElo + eloChangeFactor * (expectedForWon - 1);
      client.query("UPDATE item SET elo=$1 WHERE id=$2", [
        Math.round(newEloForWon),
        won,
      ]);
      client.query("UPDATE item SET elo=$1 WHERE id=$2", [
        Math.round(newEloForLost),
        lost,
      ]);
      res.end();
    }
    client.release();
  });

  return app;
};
