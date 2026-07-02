const { DataTypes } = require('sequelize');

let sequelize = null;
let User = null;

// Get or create the database instance
function getSequelize() {
    if (sequelize) return sequelize;
    
    // This should not happen if initDatabase() was called first
    // But handle it gracefully for edge cases
    console.warn('⚠️  User model loaded before database init - this should not happen');
    return null;
}

// Initialize the User model
function initUserModel(sequelizeInstance) {
    if (User) return User; // Already initialized
    
    sequelize = sequelizeInstance;
    
    User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 50]
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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, undefined]
            }
        },
        role: {
            type: DataTypes.ENUM('admin', 'recruiter', 'interviewer', 'candidate'),
            allowNull: false,
            defaultValue: 'candidate'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        underscored: true
    });

    return User;
}

// Get User model - returns null if not initialized
function getUserModel() {
    return User;
}

module.exports = {
    initUserModel,
    getUserModel,
    // Legacy export for backward compatibility
    get default() {
        return User;
    }
};

// For dynamic import compatibility
Object.defineProperty(module.exports, 'default', {
    get() { return User; }
});
