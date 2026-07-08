const { Sequelize } = require("sequelize");
const fs = require("fs");

let sequelize;

async function initDatabase() {
    const hasMysqlConfig =
        process.env.DB_HOST &&
        process.env.DB_USER &&
        process.env.DB_NAME &&
        process.env.DB_PASSWORD;

    console.log("==========================================");
    console.log("📦 Initializing Database...");
    console.log(`Environment : ${process.env.NODE_ENV || "development"}`);

    if (hasMysqlConfig) {
        try {
            console.log("🔄 Connecting to MySQL...");

            sequelize = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USER,
                process.env.DB_PASSWORD,
                {
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT) || 3306,
                    dialect: "mysql",

                    logging: false,

                    pool: {
                        max: 10,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },

                    define: {
                        charset: "utf8mb4",
                        collate: "utf8mb4_unicode_ci",
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

            await sequelize.authenticate();

            console.log("✅ Connected to MySQL successfully");

            await sequelize.sync({ alter: true });

            console.log("✅ Database synchronized");
            console.log("==========================================");

            return sequelize;

        } catch (error) {

            console.error("❌ MySQL Connection Failed");
            console.error(error.message);

            if (process.env.NODE_ENV === "production") {
                throw error;
            }

            console.log("⚠️ Falling back to SQLite (Development Mode)");
        }
    }

    // ----------------------------
    // SQLite (Development only)
    // ----------------------------

    if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data");
    }

    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "./data/ats.db",

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

    console.log("✅ SQLite Connected");

    await sequelize.sync({ alter: true });

    console.log("✅ SQLite Database Ready");
    console.log("==========================================");

    return sequelize;
}

function getDb() {
    if (!sequelize) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }

    return sequelize;
}

async function closeDatabase() {
    if (sequelize) {
        await sequelize.close();
        console.log("✅ Database connection closed");
    }
}

module.exports = {
    initDatabase,
    getDb,
    closeDatabase
};
