require("dotenv").config(); // Load environment variables from .env
const { Pool } = require("pg");

// Create a connection pool using environment variables
const pool = new Pool({
  host: process.env.PG_SERVER,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
});

// Export the pool for use in other parts of the application
module.exports = {
  query: (text, params) => pool.query(text, params), // Reusable query method
};
