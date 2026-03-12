// routes/users.js – /api/users/*  (admin only)

const express  = require('express');
const db       = require('../db');
const { requireAdmin, requireAuth } = require('../middleware/auth');

const router   = express.Router();

// GET /api/users  – all users (admin)
router.get('/', requireAdmin, (_req, res) => {
  const users = db.getUsers().map(({ password: _pw, ...u }) => u);
  res.json(users);
});

// DELETE /api/users/:id  – remove a user (admin)
router.delete('/:id', requireAdmin, (req, res) => {
  const users = db.getUsers();
  const user  = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  // Can't remove yourself
  if (user.email === req.user.email) {
    return res.status(400).json({ error: 'Cannot remove yourself' });
  }

  db.saveUsers(users.filter(u => u.id !== req.params.id));
  res.json({ success: true });
});

// POST /api/users/invite  – invite new team member (admin only)
router.post('/invite', requireAdmin, (req, res) => {
  const bcrypt = require('bcryptjs');
  const { v4: uuidv4 } = require('uuid');
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }
  
  // Check if email already exists
  const users = db.getUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  // Create new admin user with hashed password
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  db.saveUsers(users);
  
  // Return without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// PATCH /api/users/:id/role  – promote/demote (admin)
router.patch('/:id/role', requireAdmin, (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role))
    return res.status(400).json({ error: 'Invalid role' });

  const users = db.getUsers();
  const idx   = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  users[idx].role = role;
  db.saveUsers(users);
  const { password: _pw, ...safe } = users[idx];
  res.json(safe);
});

// GET /api/users/my-listings  – current user's own listings
router.get('/my-listings', requireAuth, (req, res) => {
  const list = db.getBusinesses().filter(b => b.owner === req.user.email);
  res.json(list);
});

module.exports = router;
