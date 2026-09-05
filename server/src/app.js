const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const apiV1Router = require('./routes/api.v1');
const { errorHandler } = require('./middleware/error.middleware');

dotenv.config();

const app = express();

// Enable CORS & Body Parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'PulseWatch Service Engine',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Versioned REST API v1
app.use('/api/v1', apiV1Router);

// Serve static frontend build in production mode
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[PulseWatch Server] Running on http://localhost:${PORT}`);
    console.log(`[PulseWatch Server] REST API prefix: http://localhost:${PORT}/api/v1`);
  });
}

module.exports = app;
