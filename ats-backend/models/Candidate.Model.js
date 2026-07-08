const { DataTypes } = require('sequelize');
const { getDb } = require('../utils/db.utils');

// Get initialized sequelize instance
const sequelize = getDb();

const Candidate = sequelize.define(
  'Candidate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    skills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },

    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    status: {
      type: DataTypes.ENUM(
        'applied',
        'shortlisted',
        'interview',
        'hired',
        'rejected'
      ),
      defaultValue: 'applied'
    },

    appliedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    source: {
      type: DataTypes.ENUM(
        'linkedin',
        'referral',
        'career_page',
        'job_board'
      ),
      defaultValue: 'career_page'
    },

    resumeUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },

    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    portfolioUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },

    linkedinUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },

    githubUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },

    appliedJobs: {
      type: DataTypes.JSON,
      defaultValue: []
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // ✅ FIXED
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },

    // ✅ FIXED
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'candidates',
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);

module.exports = Candidate;
