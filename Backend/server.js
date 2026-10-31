import "dotenv/config";

import app from "./src/app.js";
import pool from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully");

    // Ensure is_active column exists on users table for status updates
    try {
      await pool.query(
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;"
      );
    } catch (colErr) {
      console.warn("Notice: could not alter users table for is_active:", colErr.message);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
