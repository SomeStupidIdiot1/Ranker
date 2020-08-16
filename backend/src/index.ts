import express from "express";
import routes from "./routes/routes";
import databaseConfig from "./database_config";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Database
databaseConfig();

// For REST API
app.use(express.json());
app.use(routes("/api"));
app.use(
  (
    err: Error,
    _: Express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err) {
      res.status(500).send("Interal server error");
      next();
    } else res.end();
  }
);
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`);
});
