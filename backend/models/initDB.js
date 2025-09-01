const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error("❌ Error opening database " + err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      address_details TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;