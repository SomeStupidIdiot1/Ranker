import { makeItem, getSpecificTemplate } from "./template.d";
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
    const { imgStringBase64, titleOfTemplate }: makeItem = req.body;
    if (imgStringBase64.length === 0) {
      res.status(400).json({ err: "No images" });
      return;
    }
    if (!titleOfTemplate) {
      res.status(400).json({ err: "Missing title" });
      return;
    }

    const client = await getClient();

    const queryRes = await client.query(
      "SELECT id FROM list_of_items WHERE title=$1 AND owner_id=(SELECT id FROM accounts WHERE email=$2)",
      [titleOfTemplate, email]
    );
    if (queryRes.rowCount === 0) {
      res.status(500).end();
    } else {
      try {
        for (const img of imgStringBase64) {
          const imageUploadRes = await cloudinary.uploader.upload(img, {
            folder: queryRes.rows[0].id,
          });
          await client.query(
            "INSERT INTO item(image_url, image_public_id, owner_id) VALUES($1, $2, $3)",
            [imageUploadRes.url, imageUploadRes.public_id, queryRes.rows[0].id]
          );
        }
        res.end();
      } catch (err) {
        res.status(500).end();
      }
    }

    client.release();
  });
  app.get(`${baseUrl}/:id`, async (req, res) => {
    const email = getEmail(req.get("authorization"));
    if (!email) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ err: "Bad template id" });
      return;
    }
    const client = await getClient();
    const queryResForTemplate = await client.query(
      // eslint-disable-next-line
      'SELECT list_of_items.title, list_of_items.info, list_of_items.image_url AS "templateImageUrl", list_of_items.created_on AS "createdOn", list_of_items.last_updated AS "lastUpdated" FROM list_of_items, accounts WHERE list_of_items.id=$1 AND list_of_items.owner_id=accounts.id AND accounts.email=$2',
      [id, email]
    );
    if (queryResForTemplate.rowCount === 0) {
      res.status(400).json({ err: "This template doesn't exist" });
    } else {
      const queryResForItems = await client.query(
        // eslint-disable-next-line
        'SELECT item.id, item.image_url AS "itemImageUrl", item.elo FROM item WHERE item.owner_id=$1',
        [id]
      );
      const result: getSpecificTemplate = {
        ...queryResForTemplate.rows[0],
        items: queryResForItems.rows,
      };
      res.json(result);
    }
    client.release();
  });
  return app;
};
