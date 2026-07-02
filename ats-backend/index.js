require('dotenv').config(); // 👈 LOAD ENV FIRST

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL connected successfully');
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    console.log('⚠️  Server starting without database connection. Please ensure MySQL is running.');
  });

// TEMP: simple health route
app.get('/health', (req, res) => {
  res.json({ status: 'Backend running' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
