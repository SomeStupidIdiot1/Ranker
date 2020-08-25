import express from "express";
import routes from "./routes/routes";
import databaseConfig from "./db/database_config";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Database
databaseConfig();

// For REST API
app.use(express.json());
app.use(routes("/api"));
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`);
});
