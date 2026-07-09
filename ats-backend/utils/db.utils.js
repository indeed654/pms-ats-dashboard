'use strict';

const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

let sequelize = null;

/**
 * Initialize database connection.
 * Production: MySQL only.
 * Development: MySQL if configured, otherwise SQLite.
 */
async function initDatabase() {
  const isProduction = process.env.NODE_ENV === 'production';

  const mysqlConfigPresent =
    process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_NAME &&
    process.env.DB_PASSWORD;

  console.log('==========================================');
  console.log('📦 Initializing Database...');
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);

  if (mysqlConfigPresent) {
    console.log(
      `   MySQL target : ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`
    );

    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false,

        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000
        },

        define: {
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
          timestamps: true
        },

        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          },
          dateStrings: true,
          typeCast: true
        }
      }
    );

    try {
      await sequelize.authenticate();

      console.log('✅ Connected to MySQL successfully');
      console.log('==========================================');

      return sequelize;
    } catch (error) {
      console.error('❌ MySQL connection failed:', error.message);

      if (isProduction) {
        console.error('💀 Production requires a working MySQL connection.');
        process.exit(1);
      }

      console.warn('⚠️ Falling back to SQLite (development only)');
      sequelize = null;
    }
  } else if (isProduction) {
    console.error(
      '❌ Production requires DB_HOST, DB_USER, DB_NAME and DB_PASSWORD.'
    );
    process.exit(1);
  }

  const dataDir = path.resolve(__dirname, '..', 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(dataDir, 'ats.db'),
    logging: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    define: {
      timestamps: true
    }
  });

  await sequelize.authenticate();

  console.log('✅ SQLite connected (development fallback)');
  console.log('==========================================');

  return sequelize;
}

function getDb() {
  if (!sequelize) {
    throw new Error(
      'Database not initialized. Call initDatabase() before accessing the DB.'
    );
  }

  return sequelize;
}

async function closeDatabase() {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
    console.log('✅ Database connection closed');
  }
}

module.exports = {
  initDatabase,
  getDb,
  closeDatabase
};
