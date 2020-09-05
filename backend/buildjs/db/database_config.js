"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const pg_1 = require("pg");
let pool = null;
exports.default = () => {
    if (process.env.NODE_ENV === "production")
        pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    else {
        pool = new pg_1.Pool({
            user: process.env.DEVELOPMENT_DATABASE_USER,
            host: process.env.DEVELOPMENT_HOST_LOCATION,
            database: process.env.DEVELOPMENT_DATABASE_NAME,
            password: process.env.DEVELOPMENT_DATABASE_PASSWORD,
            port: parseInt(process.env.DEVELOPMENT_DATABASE_PORT),
        });
    }
    pool.on("error", (err) => {
        console.error("Unexpected error on idle client", err);
        process.exit(-1);
    });
};
exports.getClient = async () => pool.connect();
