import { getEmail } from "../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import template_item from "./template_item";
export default (baseUrl: string): Router => {
  const app = Router();

  app.get(baseUrl, async (req, res) => {
    const email = getEmail(req.get("authorization"));
    if (!email) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }

    const client = await getClient();

    const queryRes = await client.query(
      // eslint-disable-next-line
      'SELECT id, title, info, image_url AS "imageUrl", created_on AS "createdOn", last_updated AS "lastUpdated" FROM list_of_items WHERE owner_id=(SELECT id FROM accounts WHERE email=$1)',
      [email]
    );
    const result = queryRes.rows;
    res.json(result);

    client.release();
  });
  app.post(baseUrl, async (req, res) => {
    const email = getEmail(req.get("authorization"));
    if (!email) {
      res.status(401).json({ err: "Missing or invalid token" });
      return;
    }
    const { title, info, imgStringBase64 } = req.body;
    if (!title) {
      res.status(400).json({ err: "Missing title" });
      return;
    }

    const client = await getClient();

    let queryRes = null;
    try {
      queryRes = await client.query(
        "INSERT INTO list_of_items(title, info, owner_id) SELECT $1, $2, accounts.id FROM accounts WHERE email=$3 RETURNING list_of_items.id",
        [title.substring(0, 50), info ? info.substring(0, 300) : "", email]
      );
      const id = queryRes.rows[0].id;

      if (imgStringBase64) {
        try {
          const res = await cloudinary.uploader.upload(imgStringBase64, {
            folder: id,
          });
          await client.query(
            "UPDATE list_of_items SET image_url=$1, image_public_id=$2 WHERE id=$3",
            [res.url, res.public_id, id]
          );
        } catch (err) {
          console.log("Failed to upload to cloudinary.");
        }
      }
      res.json({ id });
    } catch (err) {
      res.status(400).json({ err: "Title already exists" });
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
        'SELECT item.id, item.image_url AS "itemImageUrl", item.elo, item.image_public_id AS "imageId", item.image_name AS name FROM item WHERE item.owner_id=$1',
        [id]
      );
      const result = {
        ...queryResForTemplate.rows[0],
        items: queryResForItems.rows,
      };
      res.json(result);
    }
    client.release();
  });
  app.delete(`${baseUrl}/:id`, async (req, res) => {
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

    let queryRes = null;
    try {
      queryRes = await client.query("SELECT id FROM accounts WHERE email=$1", [
        email,
      ]);
      const userId = queryRes.rows[0].id;
      queryRes = await client.query(
        "DELETE FROM item USING list_of_items WHERE list_of_items.owner_id=$1 AND list_of_items.id=$2 AND item.owner_id=list_of_items.id",
        [userId, id]
      );
      queryRes = await client.query(
        "DELETE FROM list_of_items WHERE list_of_items.id=$1",
        [id]
      );
      cloudinary.api
        .delete_resources_by_prefix(`${id}/`)
        .catch(() => console.log("Failed to delete from cloudinary."));
      res.end();
    } catch (err) {
      console.log(err.message);
      res.status(400).end();
    }
    client.release();
  });
  app.use(template_item(baseUrl));
  return app;
};
