/**
 * Seed Script - Creates test users for the ATS
 * Run: node seed.js
 * 
 * Uses SQLite file-based database for persistence.
 */

const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const fs = require('fs');

// Ensure data directory exists
const dataDir = './data';
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

// Use SQLite file to match backend
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/ats.db',
  logging: false
});

// User Model (must match the backend User model)
const User = sequelize.define('User', {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'candidate'
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Test users to create
const testUsers = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@atdrive.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 'recruiter-001',
    name: 'Recruiter User',
    email: 'recruiter@atdrive.com',
    password: 'recruiter123',
    role: 'recruiter'
  },
  {
    id: 'interviewer-001',
    name: 'Interviewer User',
    email: 'interviewer@atdrive.com',
    password: 'interviewer123',
    role: 'interviewer'
  },
  {
    id: 'candidate-001',
    name: 'Candidate User',
    email: 'candidate@atdrive.com',
    password: 'candidate123',
    role: 'candidate'
  }
];

async function seed() {
  try {
    console.log('🔄 Connecting to SQLite database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models (creates table if not exists)
    await sequelize.sync({ force: true });
    console.log('✅ Models synced');

    // Create test users
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   ├─ Admin:       admin@atdrive.com / admin123');
    console.log('   ├─ Recruiter:   recruiter@atdrive.com / recruiter123');
    console.log('   ├─ Interviewer: interviewer@atdrive.com / interviewer123');
    console.log('   └─ Candidate:   candidate@atdrive.com / candidate123');
    console.log('\n✅ Database saved to: ./data/ats.db');
    console.log('✅ Start backend to use these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
