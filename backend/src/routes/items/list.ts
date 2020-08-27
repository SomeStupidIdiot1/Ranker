import { makeList } from "./template.d";
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
    const { title, info, imgStringBase64 }: makeList = req.body;
    if (!title) {
      res.status(400).json({ err: "Missing title" });
      return;
    }

    const client = await getClient();

    let queryRes = null;
    try {
      queryRes = await client.query(
        "INSERT INTO list_of_items(title, info, owner_id) VALUES($1, $2, (SELECT id FROM accounts WHERE email=$3)) RETURNING id",
        [title, info || "", email]
      );
      if (imgStringBase64 && queryRes) {
        try {
          const id = queryRes.rows[0].id;
          console.log(`RANKER_${id} ${title}`.replace(/ /g, "_"));
          const res = await cloudinary.uploader.upload(imgStringBase64, {
            folder: `${id} ${title}`.replace(/ /g, "_"),
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
  return app;
};
