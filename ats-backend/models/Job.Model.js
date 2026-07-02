const { DataTypes } = require('sequelize');
const { getDb } = require('../utils/db.utils');

// Get the database instance
const sequelize = getDb();

const Job = sequelize.define('Job', {
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
    department: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    },
    type: {
        type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship'),
        allowNull: false
    },
    salary_min: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    salary_max: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    salary_currency: {
        type: DataTypes.ENUM('USD', 'EUR', 'GBP'),
        defaultValue: 'USD'
    },
    requirements: {
        type: DataTypes.JSON, // Store as JSON array
        allowNull: false
    },
    responsibilities: {
        type: DataTypes.JSON // Store as JSON array
    },
    benefits: {
        type: DataTypes.JSON // Store as JSON array
    },
    experienceLevel: {
        type: DataTypes.ENUM('entry', 'mid', 'senior', 'executive')
    },
    postedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    closingDate: DataTypes.DATE,
    status: {
        type: DataTypes.ENUM('draft', 'active', 'paused', 'closed'),
        allowNull: false,
        defaultValue: 'draft'
    },
    postedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    applicants: {
        type: DataTypes.JSON // Store as JSON array of applicants
    },
    closedDate: DataTypes.DATE,
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
    tableName: 'jobs',
    timestamps: true, // Handles createdAt and updatedAt
    paranoid: true, // Enables soft deletes
    underscored: true
});

module.exports = Job;
