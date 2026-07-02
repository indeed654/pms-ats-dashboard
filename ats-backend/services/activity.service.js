const { getActivityLogModel } = require('../models/ActivityLog.Model');

// Activity logging service
class ActivityLogger {
    constructor() {
        // In production, this would connect to a database
        // For now, we'll keep the in-memory approach as a fallback
    }

    // Get ActivityLog model
    getModel() {
        const Model = getActivityLogModel();
        if (!Model) {
            throw new Error('ActivityLog model not initialized. Make sure database is initialized first.');
        }
        return Model;
    }

    // Log user activities
    async logActivity(userId, action, resourceType, resourceId, details = {}) {
        try {
            const ActivityLog = this.getModel();
            const logEntry = await ActivityLog.create({
                userId,
                action,
                resourceType,
                resourceId,
                details
            });

            // Also log to console for debugging
            console.log('Activity Log:', {
                user: userId,
                action: action,
                resource: `${resourceType}:${resourceId}`,
                details: details
            });

            return logEntry;
        } catch (error) {
            console.error('Error logging activity:', error);
            // Still return the log entry data even if DB save fails
            return {
                userId,
                action,
                resourceType,
                resourceId,
                details,
                timestamp: new Date()
            };
        }
    }

    // Get logs for a specific user
    async getUserActivity(userId, limit = 50) {
        try {
            const ActivityLog = this.getModel();
            return await ActivityLog.findAll({
                where: { userId },
                order: [['timestamp', 'DESC']],
                limit: limit
            });
        } catch (error) {
            console.error('Error fetching user activity:', error);
            return [];
        }
    }

    // Get logs for a specific resource
    async getResourceActivity(resourceType, resourceId, limit = 50) {
        try {
            const ActivityLog = this.getModel();
            return await ActivityLog.findAll({
                where: { resourceType, resourceId },
                order: [['timestamp', 'DESC']],
                limit: limit
            });
        } catch (error) {
            console.error('Error fetching resource activity:', error);
            return [];
        }
    }

    // Get all logs (admin only)
    async getAllActivity(limit = 100) {
        try {
            const ActivityLog = this.getModel();
            return await ActivityLog.findAll({
                order: [['timestamp', 'DESC']],
                limit: limit
            });
        } catch (error) {
            console.error('Error fetching all activity:', error);
            return [];
        }
    }

    // Get logs by action type
    async getActionLogs(action, limit = 50) {
        try {
            const ActivityLog = this.getModel();
            return await ActivityLog.findAll({
                where: { action },
                order: [['timestamp', 'DESC']],
                limit: limit
            });
        } catch (error) {
            console.error('Error fetching action logs:', error);
            return [];
        }
    }
}

// Export singleton instance
module.exports = new ActivityLogger();
