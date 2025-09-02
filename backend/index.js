const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require("path");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Ensure database directory exists
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('Created database directory');
}

// Middleware
app.use(cors({
  origin: [
    'https://customer-management-system-one.vercel.app', // Your Vercel frontend
    'http://localhost:3000' // Local development
  ],
  credentials: true
}));
app.use(express.json());

// Routes
const customerRoutes = require("./routes/customerRoutes");
const addressRoutes = require("./routes/addressRoutes");

app.use("/api/customers", customerRoutes);
app.use("/api/customers", addressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
