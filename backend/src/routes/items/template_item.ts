import { getId } from "../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
export default (baseUrl: string): Router => {
  const app = Router();

  app.post(`${baseUrl}/:id`, async (req, res) => {
    const userId = getId(req.get("authorization"));
    if (!userId) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ err: "Bad template id" });
      return;
    }
    const { images } = req.body;
    if (images.length === 0) {
      res.status(400).json({ err: "No items" });
      return;
    }

    const client = await getClient();

    const queryRes = await client.query(
      "SELECT FROM list_of_items WHERE id=$1 AND owner_id=$2",
      [id, userId]
    );
    if (queryRes.rowCount === 0) {
      res.status(401).json({ err: "This template doesn't belong to you" });
    } else {
      client.query("UPDATE list_of_items SET last_updated=NOW() WHERE id=$1", [
        id,
      ]);
      try {
        for (const img of images) {
          if (img.imgStringBase64) {
            const imageUploadRes = await cloudinary.uploader.upload(
              img.imgStringBase64,
              {
                folder: `${id}`,
              }
            );
            await client.query(
              "INSERT INTO item(image_url, image_public_id, owner_id, image_name) VALUES($1, $2, $3, $4)",
              [
                imageUploadRes.url,
                imageUploadRes.public_id,
                id,
                img.name.substring(0, 40),
              ]
            );
          } else {
            await client.query(
              "INSERT INTO item(owner_id, image_name) VALUES($1, $2)",
              [id, img.name.substring(0, 40)]
            );
          }
        }
        res.end();
      } catch (err) {
        res.status(500).json({ err: "Couldn't upload images" }).end();
      }
    }

    client.release();
  });
  app.delete(`${baseUrl}/item/:itemId`, async (req, res) => {
    const userId = getId(req.get("authorization"));
    if (!userId) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    const itemId = parseInt(req.params.itemId);
    if (isNaN(itemId)) {
      res.status(400).json({ err: "Bad item id" });
      return;
    }

    const client = await getClient();

    let queryRes = await client.query("SELECT owner_id FROM item WHERE id=$1", [
      itemId,
    ]);
    if (queryRes.rowCount === 0) {
      res.status(400).json({ err: "This item doesn't exist" });
    } else {
      const ownerId = queryRes.rows[0].owner_id;
      queryRes = await client.query(
        "SELECT FROM list_of_items WHERE id=$1 AND owner_id=$2",
        [ownerId, userId]
      );
      if (queryRes.rowCount === 0) {
        res.status(401).end();
      } else {
        await client.query(
          "UPDATE list_of_items SET last_updated=NOW() WHERE id=$1",
          [ownerId]
        );
        queryRes = await client.query(
          "DELETE FROM item WHERE id=$1 RETURNING image_public_id",
          [itemId]
        );
        if (queryRes.rowCount) {
          cloudinary.api
            .delete_resources([queryRes.rows[0].image_public_id])
            .catch((err) =>
              console.log("cloudinary delete issue " + err.message)
            );
        }
        res.end();
      }
    }
    client.release();
  });
  app.put(`${baseUrl}/item/:id`, async (req, res) => {
    const userId = getId(req.get("authorization"));
    if (!userId) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      res.status(400).json({ err: "Bad item id" });
      return;
    }
    const { name } = req.body;
    const client = await getClient();
    let queryRes = await client.query("SELECT owner_id FROM item WHERE id=$1", [
      itemId,
    ]);

    if (queryRes.rowCount === 0) {
      res.status(400).json({ err: "This item doesn't exist" });
    } else {
      const ownerId = queryRes.rows[0].owner_id;
      queryRes = await client.query(
        "SELECT FROM list_of_items WHERE id=$1 AND owner_id=$2",
        [ownerId, userId]
      );
      if (queryRes.rowCount === 0) {
        res.status(401).end();
      } else {
        await client.query(
          "UPDATE list_of_items SET last_updated=NOW() WHERE id=$1",
          [ownerId]
        );
        queryRes = await client.query(
          "UPDATE item SET image_name=$1 WHERE id=$2",
          [name.substring(0, 40), itemId]
        );
        res.end();
      }
    }
    client.release();
  });
  return app;
};
