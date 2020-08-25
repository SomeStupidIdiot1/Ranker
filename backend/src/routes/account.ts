import { getClient } from "./../db/database_config";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export default (baseUrl: string): Router => {
  const app = Router();

  app.post(`${baseUrl}/login`, async (req, res) => {
    const { email, password } = req.body;
    const client = await getClient();
    if (!email || !password) res.status(400).json({ err: "Missing arguments" });
    else {
      const hashQuery = await client.query(
        "SELECT password_hash FROM accounts where email=$1",
        [email]
      );
      if (
        hashQuery.rowCount !== 0 &&
        !(await bcrypt.compare(password, hashQuery.rows[0].password_hash))
      )
        res.status(401).end();
      else {
        const queryRes = await client.query(
          // eslint-disable-next-line
          'SELECT display_name AS username, display_number AS "userNum", email FROM accounts WHERE email=$1',
          [email]
        );
        if (queryRes.rowCount === 0) res.status(401).end();
        else {
          const token = jwt.sign(
            { email: email },
            process.env.SECRET_TOKEN_KEY as string
          );
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
    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,40}$/.test(
        password
      )
    ) {
      res.status(400).json({ err: "Bad password" });
      return;
    }
    if (!/.+@.+/.test(email)) {
      res.status(400).json({ err: "Bad email" });
      return;
    }
    const client = await getClient();
    if (
      (await client.query("SELECT email FROM accounts WHERE email=$1", [email]))
        .rowCount !== 0
    )
      res.status(400).json({ err: "This email was already taken." });
    else {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      for (let i = 0; i < 10; i++) {
        try {
          const queryRes = await client.query(
            // eslint-disable-next-line
            'INSERT INTO accounts(display_name, display_number, password_hash, email, salt_round) VALUES($1, $2, $3, $4, $5) RETURNING display_name AS username, display_number AS "userNum", email',
            [
              username,
              ~~(Math.random() * 30000),
              passwordHash,
              email,
              saltRounds,
            ]
          );
          const token = jwt.sign(
            { email: queryRes.rows[0].email },
            process.env.SECRET_TOKEN_KEY as string
          );
          res.json({ ...queryRes.rows[0], token });
          break;
        } catch (err) {
          // Used to catch any duplicate display number
        }
      }
      res.status(400).end();
    }
    client.release();
  });
  return app;
};
