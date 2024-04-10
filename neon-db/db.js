const { Pool } = require("pg");

require("dotenv").config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// const pool = new Pool({
//   host: PGHOST,
//   database: PGDATABASE,
//   username: PGUSER,
//   password: PGPASSWORD,
//   port: 5432,

//   ssl: {
//     require: true,
//   },
// });

// // Ensure your database connection details are set in environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Use sslmode=require to enforce SSL encryption
    rejectUnauthorized: false, // Set to false if using self-signed certificates (not recommended for production)
    sslmode: 'require'
}
});


async function getPgVersion() {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT version()");

    console.log(result.rows[0]);
  } finally {
    client.release();
  }
}

getPgVersion();

module.exports = pool;