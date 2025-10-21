import pg from 'pg';
import dotenv from 'dotenv';

// load environment variables when this module is imported (used by reset.js when run directly)
dotenv.config();
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: {
      rejectUnauthorized: false
    }
};

export const pool = new pg.Pool(config);
console.log('Database pool created with config:', config);