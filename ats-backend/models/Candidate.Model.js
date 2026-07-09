'use strict';

const { DataTypes } = require('sequelize');

let Candidate = null;

/**
 * Initialize the Candidate model.
 * createdBy / updatedBy are STRING(36) to match users.id.
 */
function initCandidateModel(sequelizeInstance) {
  if (Candidate) return Candidate;

  Candidate = sequelizeInstance.define(
    'Candidate',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { len: [2, 100] },
      },
      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      skills: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('applied', 'shortlisted', 'interview', 'hired', 'rejected'),
        defaultValue: 'applied',
      },
      appliedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      source: {
        type: DataTypes.ENUM('linkedin', 'referral', 'career_page', 'job_board'),
        defaultValue: 'career_page',
      },
      resumeUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      portfolioUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      linkedinUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      githubUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      appliedJobs: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // STRING(36) matches users.id type
      createdBy: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'candidates',
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  return Candidate;
}

function getCandidateModel() {
  return Candidate;
}

module.exports = { initCandidateModel, getCandidateModel };
