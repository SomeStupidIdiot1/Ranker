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
  return app;
};
