// routes/auth.js – /api/auth/*

const express    = require('express');
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db         = require('../db');
const { requireAuth } = require('../middleware/auth');

const router     = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const EXPIRES_IN = '7d';

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email and password are required' });

  const users = db.getUsers();
  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'Email already registered' });

  // Hash password with bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: uuidv4(), name, email, password: hashedPassword, role: 'user' };
  db.saveUsers([...users, newUser]);

  res.status(201).json({ token: makeToken(newUser), user: { id: newUser.id, name, email, role: 'user' } });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });

  const user = db.getUserByEmail(email);
  
  // Use bcrypt to compare passwords
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// GET /api/auth/me  – returns current user from token
router.get('/me', requireAuth, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _pw, ...safe } = user;
  res.json(safe);
});

module.exports = router;
