// db.js – simple JSON flat-file database helper
// In production, replace with MongoDB/PostgreSQL calls using the same interface.

const fs   = require('fs');
const path = require('path');

const BIZ_FILE   = path.join(__dirname, 'data', 'businesses.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const NEWS_FILE  = path.join(__dirname, 'data', 'news.json');

function read(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function write(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Businesses ──────────────────────────────────────────────────────────────
const db = {
  getBusinesses:    ()          => read(BIZ_FILE),
  saveBusinesses:   (data)      => write(BIZ_FILE, data),
  getBizById:       (id)        => read(BIZ_FILE).find(b => b.id === id) || null,

  // ── Users ────────────────────────────────────────────────────────────────
  getUsers:         ()          => read(USERS_FILE),
  saveUsers:        (data)      => write(USERS_FILE, data),
  getUserByEmail:   (email)     => read(USERS_FILE).find(u => u.email === email) || null,
  getUserById:      (id)        => read(USERS_FILE).find(u => u.id === id) || null,

  // ── News ─────────────────────────────────────────────────────────────────
  getNews:          ()          => read(NEWS_FILE),
  saveNews:         (data)      => write(NEWS_FILE, data),
  getNewsById:      (id)        => read(NEWS_FILE).find(n => n.id === id) || null,
};

module.exports = db;
