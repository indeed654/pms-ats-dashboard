const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME || 'ats_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: console.log, // In production, you might want to set this to false or use a custom logger
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: true
        },
        dialectOptions: {
            // Prevent deprecation warnings
            dateStrings: true,
            typeCast: true
        }
    }
);

module.exports = sequelize;
