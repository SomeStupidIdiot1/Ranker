import { Pool, PoolClient } from "pg";

let pool: Pool | null = null;

export default (): void => {
  if (process.env.NODE_ENV === "production")
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  else {
    pool = new Pool({
      user: process.env.DEVELOPMENT_DATABASE_USER,
      host: process.env.DEVELOPMENT_HOST_LOCATION,
      database: process.env.DEVELOPMENT_DATABASE_NAME,
      password: process.env.DEVELOPMENT_DATABASE_PASSWORD,
      port: parseInt(process.env.DEVELOPMENT_DATABASE_PORT as string),
    });
  }
  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });
};
export const getClient = async (): Promise<PoolClient> =>
  (pool as Pool).connect();
