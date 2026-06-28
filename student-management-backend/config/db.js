const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Database Connection Error:", err.message);
  }

  console.log("✅ PostgreSQL Connected Successfully");
  release();
});

module.exports = pool;
