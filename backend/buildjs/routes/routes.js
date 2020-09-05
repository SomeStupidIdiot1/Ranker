"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = require("./../db/database_config");
const express_1 = require("express");
const account_1 = __importDefault(require("./account/account"));
const template_1 = __importDefault(require("./items/template"));
const ranking_1 = __importDefault(require("./ranking/ranking"));
exports.default = (baseUrl) => {
    const app = express_1.Router();
    app.get(baseUrl, async (_, res) => {
        const client = await database_config_1.getClient();
        const queryRes = await client.query("SELECT NOW()");
        res.send(queryRes.rows[0].now);
        client.release();
    });
    app.use(account_1.default(baseUrl));
    app.use(template_1.default(`${baseUrl}/template`));
    app.use(ranking_1.default(`${baseUrl}/play`));
    return app;
};
