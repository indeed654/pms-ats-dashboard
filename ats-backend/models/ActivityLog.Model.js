const { DataTypes } = require('sequelize');

let sequelize = null;
let ActivityLog = null;

// Initialize the ActivityLog model
function initActivityLogModel(sequelizeInstance) {
    if (ActivityLog) return ActivityLog; // Already initialized
    
    sequelize = sequelizeInstance;
    
    ActivityLog = sequelize.define('ActivityLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        action: {
            type: DataTypes.ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ACCESS'),
            allowNull: false
        },
        resourceType: {
            type: DataTypes.ENUM('user', 'candidate', 'job', 'interview', 'document', 'auth', 'dashboard', 'aijd'),
            allowNull: false
        },
        resourceId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ipAddress: DataTypes.STRING,
        userAgent: DataTypes.STRING,
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        details: DataTypes.JSON // Store as JSON object
    }, {
        tableName: 'activity_logs',
        timestamps: true, // Handles createdAt and updatedAt
        underscored: true
    });

    return ActivityLog;
}

// Get ActivityLog model - returns null if not initialized
function getActivityLogModel() {
    return ActivityLog;
}

module.exports = {
    initActivityLogModel,
    getActivityLogModel
};
