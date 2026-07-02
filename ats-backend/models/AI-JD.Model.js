const { DataTypes } = require('sequelize');
const { getDb } = require('../utils/db.utils');

// Get the database instance
const sequelize = getDb();

const AIJD = sequelize.define('AIJD', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [20, 5000]
        }
    },
    requirements: {
        type: DataTypes.JSON // Store as JSON array
    },
    responsibilities: {
        type: DataTypes.JSON // Store as JSON array
    },
    skills: {
        type: DataTypes.JSON // Store as JSON array
    },
    experienceLevel: {
        type: DataTypes.ENUM('entry', 'mid', 'senior', 'executive')
    },
    salaryRange_min: DataTypes.DECIMAL(10, 2),
    salaryRange_max: DataTypes.DECIMAL(10, 2),
    salaryRange_currency: DataTypes.STRING,
    generatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    generationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    prompt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    aiModelUsed: DataTypes.STRING,
    qualityScore: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 10
        }
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    usedInJobId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'jobs',
            key: 'id'
        }
    },
    notes: DataTypes.TEXT,
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
    tableName: 'ai_job_descriptions',
    timestamps: true, // Handles createdAt and updatedAt
    paranoid: true, // Enables soft deletes
    underscored: true
});

module.exports = AIJD;
