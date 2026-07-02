const { DataTypes } = require('sequelize');
const { getDb } = require('../utils/db.utils');

// Get the database instance
const sequelize = getDb();

const Interview = sequelize.define('Interview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'candidates',
            key: 'id'
        }
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'jobs',
            key: 'id'
        }
    },
    interviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    scheduleDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 15,
            max: 240 // Maximum 4 hours
        }
    },
    type: {
        type: DataTypes.ENUM('technical', 'hr', 'behavioral', 'final'),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 200]
        }
    },
    meetingLink: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled'),
        defaultValue: 'scheduled'
    },
    feedback_rating: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        }
    },
    feedback_comments: DataTypes.TEXT,
    feedback_recommendation: {
        type: DataTypes.ENUM('hire', 'reject', 'consider')
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
    tableName: 'interviews',
    timestamps: true, // Handles createdAt and updatedAt
    paranoid: true, // Enables soft deletes
    underscored: true
});

module.exports = Interview;
