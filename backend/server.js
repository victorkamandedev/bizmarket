// server.js – BizMarket API entry point
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const path      = require('path');

const authRoutes       = require('./routes/auth');
const businessRoutes   = require('./routes/businesses');
const userRoutes       = require('./routes/users');
const newsRoutes       = require('./routes/news');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));           // large base64 images
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/news',       newsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  const fs = require('fs');
  const filesExist = {
    usersJson: fs.existsSync('./data/users.json'),
    businessesJson: fs.existsSync('./data/businesses.json'),
    newsJson: fs.existsSync('./data/news.json'),
  };
  
  res.json({ 
    status: 'ok', 
    time: new Date(),
    env: process.env.NODE_ENV || 'development',
    files: filesExist
  });
});

// Debug endpoint - check what CORS sees
app.get('/api/debug', (_req, res) => {
  res.json({
    FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET',
    CORS_ORIGIN: process.env.FRONTEND_URL || 'http://localhost:5173',
    all_env_keys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY'))
  });
});

// 404 catch-all
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🏢 BizMarket API running → http://localhost:${PORT}`);
  console.log(`   Health check          → http://localhost:${PORT}/api/health\n`);
});
