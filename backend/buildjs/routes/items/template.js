"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const database_config_1 = require("../../db/database_config");
const express_1 = require("express");
const cloudinary_1 = require("cloudinary");
const template_item_1 = __importDefault(require("./template_item"));
exports.default = (baseUrl) => {
    const app = express_1.Router();
    app.get(baseUrl, async (req, res) => {
        const userId = helper_1.getId(req.get("authorization"));
        if (!userId) {
            res.status(401).json({ err: "Missing or invalid token" });
            return;
        }
        const client = await database_config_1.getClient();
        const queryRes = await client.query(
        // eslint-disable-next-line
        'SELECT id, title, info, image_url AS "imageUrl", created_on AS "createdOn", last_updated AS "lastUpdated" FROM list_of_items WHERE owner_id=$1', [userId]);
        const result = queryRes.rows;
        res.json(result);
        client.release();
    });
    app.post(baseUrl, async (req, res) => {
        const userId = helper_1.getId(req.get("authorization"));
        if (!userId) {
            res.status(401).json({ err: "Missing or invalid token" });
            return;
        }
        const { title, info, imgStringBase64 } = req.body;
        if (!title) {
            res.status(400).json({ err: "Missing title" });
            return;
        }
        const client = await database_config_1.getClient();
        let queryRes = null;
        try {
            queryRes = await client.query("INSERT INTO list_of_items(title, info, owner_id) VALUES($1, $2, $3) RETURNING id", [title.substring(0, 50), info ? info.substring(0, 300) : "", userId]);
            const templateId = queryRes.rows[0].id;
            if (imgStringBase64) {
                try {
                    const res = await cloudinary_1.v2.uploader.upload(imgStringBase64, {
                        folder: templateId,
                    });
                    await client.query("UPDATE list_of_items SET image_url=$1, image_public_id=$2 WHERE id=$3", [res.url, res.public_id, templateId]);
                }
                catch (err) {
                    console.log("Failed to upload to cloudinary.");
                }
            }
            res.json({ id: templateId });
        }
        catch (err) {
            res.status(400).json({ err: "Title already exists" });
        }
        client.release();
    });
    app.get(`${baseUrl}/:id`, async (req, res) => {
        const userId = helper_1.getId(req.get("authorization"));
        if (!userId) {
            res.status(401).json({ err: "Missing or invalid token" });
            return;
        }
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ err: "Bad template id" });
            return;
        }
        const client = await database_config_1.getClient();
        const queryResForTemplate = await client.query(
        // eslint-disable-next-line
        'SELECT title, info, image_url AS "templateImageUrl", created_on AS "createdOn", last_updated AS "lastUpdated" FROM list_of_items WHERE id=$1 AND owner_id=$2', [id, userId]);
        if (queryResForTemplate.rowCount === 0) {
            res.status(400).json({ err: "This template doesn't exist" });
        }
        else {
            const queryResForItems = await client.query(
            // eslint-disable-next-line
            'SELECT id, image_url AS "itemImageUrl", elo, image_public_id AS "imageId", image_name AS name FROM item WHERE owner_id=$1', [id]);
            const result = {
                ...queryResForTemplate.rows[0],
                items: queryResForItems.rows,
            };
            res.json(result);
        }
        client.release();
    });
    app.delete(`${baseUrl}/:id`, async (req, res) => {
        const userId = helper_1.getId(req.get("authorization"));
        if (!userId) {
            res.status(401).json({ err: "Missing or invalid token" });
            return;
        }
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ err: "Bad template id" });
            return;
        }
        const client = await database_config_1.getClient();
        try {
            await client.query("DELETE FROM item USING list_of_items WHERE list_of_items.owner_id=$1 AND list_of_items.id=$2 AND item.owner_id=list_of_items.id", [userId, id]);
            await client.query("DELETE FROM list_of_items WHERE list_of_items.id=$1", [id]);
            cloudinary_1.v2.api
                .delete_resources_by_prefix(`${id}/`)
                .catch(() => console.log("Failed to delete from cloudinary."));
            res.end();
        }
        catch (err) {
            console.log(err.message);
            res.status(400).end();
        }
        client.release();
    });
    app.put(`${baseUrl}/:id`, async (req, res) => {
        const userId = helper_1.getId(req.get("authorization"));
        if (!userId) {
            res.status(401).json({ err: "Missing or invalid token" });
            return;
        }
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ err: "Bad template id" });
            return;
        }
        const { title, info } = req.body;
        const client = await database_config_1.getClient();
        await client.query("UPDATE list_of_items SET title=$1, info=$2 WHERE id=$3 AND owner_id=$4 RETURNING id", [title.substring(0, 50), info.substring(0, 300), id, userId]);
        const queryRes = await client.query("UPDATE list_of_items SET last_updated=NOW() WHERE id=$1 RETURNING NOW() AS updated", [id]);
        const updatedTime = queryRes.rows[0].updated;
        res.json({ updatedTime });
        client.release();
    });
    app.use(template_item_1.default(baseUrl));
    return app;
};
