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
      client.query("UPDATE list_of_items SET last_updated=NOW()");
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

  return app;
};
