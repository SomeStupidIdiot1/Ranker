import { getEmail } from "./../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
export default (baseUrl: string): Router => {
  const app = Router();

  app.post(`${baseUrl}/make_list`, async (req, res) => {
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
        "INSERT INTO list_of_items(title, info, owner_id) SELECT $1, $2, id FROM accounts WHERE email=$3 RETURNING id",
        [title, info || "", email]
      );
      if (imgStringBase64) {
        try {
          const id = queryRes.rows[0].id;
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
      res.end();
    } catch (err) {
      res.status(400).json({ err: "Title already exists" });
    }

    client.release();
  });
  app.get(`${baseUrl}/get_list`, async (req, res) => {
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
  return app;
};
