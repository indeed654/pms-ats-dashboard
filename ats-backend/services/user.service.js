const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
    // Get User model - dynamically to avoid initialization issues
    getUserModel() {
        const userModel = require("../models/User.Model");
        const Model = userModel.getUserModel ? userModel.getUserModel() : userModel.default;
        if (!Model) {
            throw new Error('User model not initialized. Make sure database is initialized first.');
        }
        return Model;
    }

    // User registration
    async register(userData) {
        try {
            const { id, name, email, password, role, createdAt } = userData;
            const User = this.getUserModel();
            
            // Check if user already exists
            const existingUser = await User.findOne({ 
                where: { email, isDeleted: false }
            });
            if (existingUser) {
                throw new Error("User already exists");
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create new user
            const newUser = await User.create({ 
                id, 
                name, 
                email, 
                password: hashedPassword, 
                role, 
                createdAt 
            });
            
            // Log activity
            try {
                const activityLogger = require("./activity.service");
                await activityLogger.logActivity(
                    newUser.id.toString(), 
                    'CREATE', 
                    'user', 
                    newUser.id.toString(), 
                    { role: newUser.role }
                );
            } catch (e) {
                // Activity logging is optional
            }
            
            // Return user data without password
            const userObject = newUser.toJSON ? newUser.toJSON() : newUser;
            delete userObject.password;
            delete userObject.deleted_at;
            return userObject;
        } catch (error) {
            throw error;
        }
    }
    
    // User login
    async login(email, password) {
        try {
            const User = this.getUserModel();
            
            // Find user by email
            const user = await User.findOne({ 
                where: { email, isDeleted: false }
            });
            if (!user) {
                throw new Error("Invalid email or password");
            }
            
            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error("Invalid email or password");
            }
            
            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user.id.toString(), 
                    email: user.email, 
                    name: user.name,
                    role: user.role
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: "1d" }
            );
            
            // Log activity
            try {
                const activityLogger = require("./activity.service");
                await activityLogger.logActivity(
                    user.id.toString(), 
                    'LOGIN', 
                    'auth', 
                    user.id.toString(), 
                    { email: user.email }
                );
            } catch (e) {
                // Activity logging is optional
            }
            
            // Return user data without password
            const userObject = user.toJSON ? user.toJSON() : user;
            delete userObject.password;
            delete userObject.deleted_at;
            return { token, user: userObject };
        } catch (error) {
            throw error;
        }
    }
    
    // Find user by email
    async findUserByEmail(email) {
        try {
            const User = this.getUserModel();
            return await User.findOne({ 
                where: { email, isDeleted: false }
            });
        } catch (error) {
            throw error;
        }
    }
    
    // Get user by ID
    async getUserById(userId) {
        try {
            const User = this.getUserModel();
            return await User.findByPk(userId);
        } catch (error) {
            throw error;
        }
    }
    
    // Update user
    async updateUser(userId, updateData) {
        try {
            const User = this.getUserModel();
            const user = await User.update(
                { ...updateData },
                { where: { id: userId }, returning: true }
            );
            
            if (user[0] === 0) {
                throw new Error("User not found");
            }
            
            const updatedUser = await User.findByPk(userId);
            const userObject = updatedUser.toJSON ? updatedUser.toJSON() : updatedUser;
            delete userObject.password;
            delete userObject.deleted_at;
            return userObject;
        } catch (error) {
            throw error;
        }
    }
    
    // Delete user (soft delete)
    async deleteUser(userId) {
        try {
            const User = this.getUserModel();
            const user = await User.update(
                { isDeleted: true },
                { where: { id: userId } }
            );
            
            if (user[0] === 0) {
                throw new Error("User not found");
            }
            
            return { message: "User deleted successfully" };
        } catch (error) {
            throw error;
        }
    }
    
    // Get all users (admin only)
    async getAllUsers() {
        try {
            const User = this.getUserModel();
            return await User.findAll({ 
                where: { isDeleted: false }
            });
        } catch (error) {
            throw error;
        }
    }
    
    // Validate user role
    static validateRole(role) {
        const validRoles = ['admin', 'recruiter', 'interviewer', 'candidate'];
        return validRoles.includes(role);
    }
    
    // Check if user has required role
    static hasRole(userRole, requiredRoles) {
        return requiredRoles.includes(userRole);
    }
}

module.exports = new UserService();
