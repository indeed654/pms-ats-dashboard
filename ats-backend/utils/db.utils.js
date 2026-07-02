const { Sequelize } = require('sequelize');

let sequelize;

// Initialize database - tries MySQL only if password is provided
async function initDatabase() {
    const hasMysqlPassword = process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim().length > 0;
    
    console.log(`📊 Database init:`, hasMysqlPassword ? 'MySQL configured' : 'SQLite (no MySQL password)');
    
    if (hasMysqlPassword) {
        try {
            sequelize = new Sequelize(
                process.env.DB_NAME || 'ats_db',
                process.env.DB_USER || 'root',
                process.env.DB_PASSWORD || '',
                {
                    host: process.env.DB_HOST || 'localhost',
                    dialect: 'mysql',
                    port: process.env.DB_PORT || 3306,
                    logging: false,
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
                        dateStrings: true,
                        typeCast: true
                    }
                }
            );

            await sequelize.authenticate();
            console.log('✅ Connected to MySQL database');
            
            await sequelize.sync({ alter: true });
            console.log('✅ Database synchronized');
            
            return sequelize;
        } catch (mysqlError) {
            console.error('❌ MySQL connection failed:', mysqlError.message);
            console.log('⚠️  Falling back to SQLite...');
        }
    }
    
    // Use SQLite - no MySQL password provided or MySQL failed
    const fs = require('fs');
    const dataDir = './data';
    if (!fs.existsSync(dataDir)){
        fs.mkdirSync(dataDir);
    }

    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './data/ats.db',
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
    console.log('✅ Connected to SQLite database');
    
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ SQLite database synchronized');
    
    return sequelize;
}

function getDb() {
    if (!sequelize) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return sequelize;
}

module.exports = {
    initDatabase,
    getDb
};
