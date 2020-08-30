import { getEmail } from "../helper";
import { getClient } from "../../db/database_config";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
export default (baseUrl: string): Router => {
  const app = Router();

  app.post(`${baseUrl}/:id`, async (req, res) => {
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
    const { imgStringBase64 } = req.body;
    if (imgStringBase64.length === 0) {
      res.status(400).json({ err: "No images" });
      return;
    }

    const client = await getClient();

    const queryRes = await client.query(
      "SELECT FROM list_of_items, accounts WHERE list_of_items.id=$1 AND list_of_items.owner_id=accounts.id AND accounts.email=$2",
      [id, email]
    );
    if (queryRes.rowCount === 0) {
      res.status(401).json({ err: "This template doesn't belong to you" });
    } else {
      try {
        for (const img of imgStringBase64) {
          const imageUploadRes = await cloudinary.uploader.upload(img, {
            folder: queryRes.rows[0].id,
          });
          await client.query(
            "INSERT INTO item(image_url, image_public_id, owner_id) VALUES($1, $2, $3)",
            [imageUploadRes.url, imageUploadRes.public_id, id]
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
