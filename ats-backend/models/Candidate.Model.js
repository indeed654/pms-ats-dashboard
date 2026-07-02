const { DataTypes } = require('sequelize');
const { getDb } = require('../utils/db.utils');

// Get the database instance
const sequelize = getDb();

const Candidate = sequelize.define('Candidate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
        }
    },
    skills: {
        type: DataTypes.JSON, // Store as JSON array
        allowNull: false
    },
    experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 50
        }
    },
    status: {
        type: DataTypes.ENUM('applied', 'shortlisted', 'interview', 'hired', 'rejected'),
        allowNull: false,
        defaultValue: 'applied'
    },
    appliedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    source: {
        type: DataTypes.ENUM('linkedin', 'referral', 'career_page', 'job_board'),
        defaultValue: 'career_page'
    },
    resumeUrl: {
        type: DataTypes.STRING,
        validate: {
            is: [/^https?:\/\/.+\.(pdf|doc|docx)$/i, 'Resume must be a PDF or DOC file']
        }
    },
    coverLetter: DataTypes.TEXT,
    portfolioUrl: DataTypes.STRING,
    linkedinUrl: DataTypes.STRING,
    githubUrl: DataTypes.STRING,
    appliedJobs: {
        type: DataTypes.JSON // Store as JSON array of job applications
    },
    notes: DataTypes.TEXT,
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'candidates',
    timestamps: true, // Handles createdAt and updatedAt
    paranoid: true, // Enables soft deletes
    underscored: true
});

module.exports = Candidate;
