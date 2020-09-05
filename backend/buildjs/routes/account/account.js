"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = require("../../db/database_config");
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (baseUrl) => {
    const app = express_1.Router();
    app.post(`${baseUrl}/login`, async (req, res) => {
        const { email, password } = req.body;
        const client = await database_config_1.getClient();
        if (!email || !password)
            res.status(400).json({ err: "Missing arguments" });
        else {
            const hashQuery = await client.query("SELECT password_hash FROM accounts where email=$1", [email]);
            if (hashQuery.rowCount !== 0 &&
                !(await bcrypt_1.default.compare(password, hashQuery.rows[0].password_hash)))
                res.status(401).end();
            else {
                const queryRes = await client.query(
                // eslint-disable-next-line
                'SELECT display_name AS username, display_number AS "userNum", id FROM accounts WHERE email=$1', [email]);
                if (queryRes.rowCount === 0)
                    res.status(401).end();
                else {
                    const tokenContent = queryRes.rows[0].id;
                    const token = jsonwebtoken_1.default.sign(tokenContent, process.env.SECRET_TOKEN_KEY);
                    res.json({ ...queryRes.rows[0], token });
                }
            }
        }
        client.release();
    });
    app.post(`${baseUrl}/register`, async (req, res) => {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            res.status(400).json({ err: "Missing arguments" });
            return;
        }
        if (!/\d/.test(password) ||
            password.toLowerCase() === password ||
            !password.match(/[#?!@$%^&*-]/) ||
            password.length < 8 ||
            password.length > 40) {
            res.status(400).json({ err: "Bad password" });
            return;
        }
        if (!/.+@.+/.test(email) || email.length > 100) {
            res.status(400).json({ err: "Bad email" });
            return;
        }
        const client = await database_config_1.getClient();
        if ((await client.query("SELECT email FROM accounts WHERE email=$1", [email]))
            .rowCount !== 0)
            res.status(400).json({ err: "This email was already taken." });
        else {
            const saltRounds = 10;
            const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
            for (let i = 0; i < 10; i++) {
                try {
                    const queryRes = await client.query(
                    // eslint-disable-next-line
                    'INSERT INTO accounts(display_name, display_number, password_hash, email, salt_round) VALUES($1, $2, $3, $4, $5) RETURNING display_name AS username, display_number AS "userNum", email, id AS "userId"', [
                        username,
                        ~~(Math.random() * 30000),
                        passwordHash,
                        email,
                        saltRounds,
                    ]);
                    const tokenContent = queryRes.rows[0].userId;
                    const token = jsonwebtoken_1.default.sign(tokenContent, process.env.SECRET_TOKEN_KEY);
                    res.json({ ...queryRes.rows[0], token });
                    break;
                }
                catch (err) {
                    // Used to catch any duplicate display number
                }
            }
            res.status(400).end();
        }
        client.release();
    });
    return app;
};
