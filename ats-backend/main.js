const dotenv = require("dotenv");

// Load environment variables FIRST - before any other imports
dotenv.config({ path: "./config/config.env" });

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 8000;

// Log which database is being used
console.log('==========================================');
console.log('🚀 Starting ATS Backend...');
console.log('==========================================');
console.log(`📦 Database configuration:`);
console.log(`   DB_TYPE: ${process.env.DB_TYPE || 'mysql'}`);
if (process.env.DB_PASSWORD) {
    console.log(`   Using MySQL: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'ats_db'}`);
} else {
    console.log(`   SQLite mode: ./data/ats.db`);
}

let dbInitialized = false;

async function startServer() {
    try {
        const { initDatabase, getDb } = require('./utils/db.utils');
        const sequelize = await initDatabase();
        dbInitialized = true;
        console.log('✅ Database initialized successfully');
        
        // Initialize User model AFTER database is ready
        const { initUserModel } = require('./models/User.Model');
        initUserModel(sequelize);
        console.log('✅ User model initialized');
        
        // Initialize ActivityLog model - after User model
        const { initActivityLogModel } = require('./models/ActivityLog.Model');
        initActivityLogModel(sequelize);
        console.log('✅ ActivityLog model initialized');
        
        // Initialize other models
        require('./models/Candidate.Model');
        require('./models/Job.Model');
        require('./models/Interview.Model');
        require('./models/Document.Model');
        require('./models/AI-JD.Model');
        console.log('✅ All models initialized');
        
        // Now sync database with all models
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized with models');
        
        console.log('==========================================');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.log('⚠️  Server starting without database connection.');
    }

    // Security middleware
    app.use(helmet());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: {
            status: "N",
            error: "Too many requests, please try again later."
        }
    });
    app.use(limiter);

    // CORS configuration
    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:4200",
        credentials: true
    }));

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    app.use(morgan("combined"));

    // ROUTES
    const authRoutes = require("./routes/auth");
    const candidateRoutes = require("./routes/candidate");
    const interviewRoutes = require("./routes/interview");
    const jobRoutes = require("./routes/job");
    const activitylogRoutes = require("./routes/activitylog");
    const aijdRoutes = require("./routes/aijd");
    const documentRoutes = require("./routes/document");
    const dashboardRoutes = require("./routes/dashboard");

    // API Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/candidate", candidateRoutes);
    app.use("/api/interview", interviewRoutes);
    app.use("/api/job", jobRoutes);
    app.use("/api/activitylog", activitylogRoutes);
    app.use("/api/aijd", aijdRoutes);
    app.use("/api/document", documentRoutes);
    app.use("/api/dashboard", dashboardRoutes);

    // Error handling middleware
    const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");
    app.use(notFoundHandler);
    app.use(errorHandler);

    // Health check endpoint
    app.get("/health", (req, res) => {
        res.status(200).json({
            status: "Y",
            message: "ATS Backend is running",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: dbInitialized ? "connected" : "disconnected"
        });
    });

    // Seed default users if using SQLite (only in development)
    if (dbInitialized && !process.env.DB_PASSWORD) {
        await seedDefaultUsers();
    }

    app.listen(PORT, () => {
        console.log(`✅ Server is running on PORT ${PORT}`);
        console.log(`🛡️  Security features enabled`);
        console.log(`📊 Rate limiting: 100 requests per 15 minutes`);
        console.log(`🔒 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:4200"}`);
        console.log(`💾 Database status: ${dbInitialized ? 'Connected' : 'Disconnected'}`);
        console.log('==========================================');
    });
}

// Seed default users for SQLite development
async function seedDefaultUsers() {
    try {
        // Get User model from the initialized module
        const { getUserModel } = require('./models/User.Model');
        const UserModel = getUserModel();
        
        if (!UserModel) {
            console.error('⚠️  User model not initialized');
            return;
        }
        
        const bcrypt = require("bcryptjs");
        
        // Check if admin exists
        const adminExists = await UserModel.findOne({ where: { email: 'admin@ats.local' } });
        
        if (!adminExists) {
            console.log('🔄 Seeding default users...');
            
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            
            // Create admin
            await UserModel.create({
                id: 'admin-001',
                name: 'Admin User',
                email: 'admin@ats.local',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created: admin@ats.local / Admin@123');
            
            // Create recruiter
            await UserModel.create({
                id: 'recruiter-001',
                name: 'Recruiter User',
                email: 'recruiter@ats.local',
                password: hashedPassword,
                role: 'recruiter'
            });
            console.log('✅ Recruiter user created: recruiter@ats.local / Admin@123');
            
            // Create interviewer
            await UserModel.create({
                id: 'interviewer-001',
                name: 'Interviewer User',
                email: 'interviewer@ats.local',
                password: hashedPassword,
                role: 'interviewer'
            });
            console.log('✅ Interviewer user created: interviewer@ats.local / Admin@123');
            
            // Create candidate
            await UserModel.create({
                id: 'candidate-001',
                name: 'Candidate User',
                email: 'candidate@ats.local',
                password: hashedPassword,
                role: 'candidate'
            });
            console.log('✅ Candidate user created: candidate@ats.local / Admin@123');
            
            console.log('🎉 Default users seeded successfully!');
        } else {
            console.log('✅ Users already exist, skipping seed');
        }
    } catch (error) {
        console.error('⚠️  Seed error:', error.message);
    }
}

startServer();
