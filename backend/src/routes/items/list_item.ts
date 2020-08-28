import { makeItem } from "./template.d";
import { getEmail } from "./../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
export default (baseUrl: string): Router => {
  const app = Router();

  app.post(`${baseUrl}/make_item`, async (req, res) => {
    const email = getEmail(req.get("authorization"));
    if (!email) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    const { itemName, imgStringBase64, titleOfTemplate }: makeItem = req.body;
    if (!itemName) {
      res.status(400).json({ err: "Missing item name" });
      return;
    }
    if (!titleOfTemplate) {
      res.status(400).json({ err: "Missing title" });
      return;
    }

    const client = await getClient();

    let queryRes = null;
    try {
      queryRes = await client.query(
        "INSERT INTO item(item_name, owner_id) SELECT $1, id FROM list_of_items WHERE title=$3 AND owner_id=(SELECT id FROM accounts WHERE email=$2) RETURNING owner_id AS owner, id",
        [itemName, email, titleOfTemplate]
      );
      if (queryRes.rowCount === 0) throw new Error("Empty query");
      if (imgStringBase64) {
        try {
          const id = queryRes.rows[0].id;
          const ownerId = queryRes.rows[0].owner;
          const res = await cloudinary.uploader.upload(imgStringBase64, {
            folder: ownerId,
          });
          await client.query(
            "UPDATE item SET image_url=$1, image_public_id=$2 WHERE id=$3",
            [res.url, res.public_id, id]
          );
        } catch (err) {
          console.log("Failed to upload to cloudinary.");
        }
      }
      res.end();
    } catch (err) {
      res.status(400).json({ err: "Template does not exist" });
    }

    client.release();
  });
  return app;
};
