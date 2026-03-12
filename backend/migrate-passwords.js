// backend/migrate-passwords.js
// Run this ONCE to hash all plain text passwords

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

console.log('🔐 Migrating passwords to bcrypt hashes...\n');

// Read current users
const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

// Hash each user's password
const updatedUsers = users.map(user => {
  // Skip if already hashed (starts with $2a$ or $2b$)
  if (user.password.startsWith('$2')) {
    console.log(`✓ ${user.email} - already hashed`);
    return user;
  }
  
  // Hash the plain text password
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  console.log(`✓ ${user.email} - hashed (was: ${user.password})`);
  
  return {
    ...user,
    password: hashedPassword
  };
});

// Save updated users
fs.writeFileSync(USERS_FILE, JSON.stringify(updatedUsers, null, 2));

console.log('\n✅ Migration complete! All passwords are now hashed.');
console.log('⚠️  Original passwords have been replaced. Note them down:');
console.log('   - admin@marketplace.com: admin123');
console.log('   - acme@example.com: pass123');
console.log('   - food@example.com: pass123');
console.log('   - cafe@example.com: pass123');
