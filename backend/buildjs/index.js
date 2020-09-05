"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const database_config_1 = __importDefault(require("./db/database_config"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express_1.default();
const PORT = process.env.PORT || 8080;
// Database
database_config_1.default();
// For REST API
app.use(express_1.default.json({ limit: "50mb" }));
app.use(routes_1.default("/api"));
app.listen(PORT, () => {
    console.log(`Starting server on port ${PORT}`);
});
