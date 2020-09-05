import express from "express";
import routes from "./routes/routes";
import databaseConfig from "./db/database_config";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
const PORT = process.env.PORT || 8080;

// Database
databaseConfig();

// Production files
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("build"));
}
// For REST API
app.use(express.json({ limit: "50mb" }));
app.use(routes("/api"));
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`);
});
