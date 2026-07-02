const { DataTypes } = require('sequelize');
const { getDb } = require('../utils/db.utils');

// Get the database instance
const sequelize = getDb();

const Dashboard = sequelize.define('Dashboard', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'recruiter', 'interviewer', 'candidate'),
        allowNull: false
    },
    layout: {
        type: DataTypes.JSON // Store as JSON object
    },
    preferences: {
        type: DataTypes.JSON // Store as JSON object
    },
    lastAccessed: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    widgets: {
        type: DataTypes.JSON // Store as JSON array
    },
    customViews: {
        type: DataTypes.JSON // Store as JSON object
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
    tableName: 'dashboards',
    timestamps: true, // Handles createdAt and updatedAt
    paranoid: true, // Enables soft deletes
    underscored: true
});

module.exports = Dashboard;
