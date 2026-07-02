const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require("../middleware/auth.middleware");
const activityLogger = require("../services/activity.service");

// Get all activity logs - admin only
router.get("/", 
    authenticateJWT,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const logs = activityLogger.getAllActivity();
            return res.status(200).json({ 
                status: "Y", 
                message: "Activity logs retrieved successfully", 
                data: logs 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Get user activity logs - admin and user themselves
router.get("/user/:userId", 
    authenticateJWT,
    async (req, res) => {
        try {
            // Allow user to access their own logs or admin to access any
            const isOwnLogs = req.user.userId === req.params.userId;
            const isAdmin = req.user.role === "admin";
            
            if (!isOwnLogs && !isAdmin) {
                return res.status(403).json({ 
                    status: "N", 
                    error: "Access denied" 
                });
            }
            
            const logs = activityLogger.getUserActivity(req.params.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "User activity logs retrieved successfully", 
                data: logs 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Get resource activity logs - admin only
router.get("/resource/:resourceType/:resourceId", 
    authenticateJWT,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const logs = activityLogger.getResourceActivity(
                req.params.resourceType, 
                req.params.resourceId
            );
            return res.status(200).json({ 
                status: "Y", 
                message: "Resource activity logs retrieved successfully", 
                data: logs 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Get action-based logs - admin only
router.get("/action/:action", 
    authenticateJWT,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const logs = activityLogger.getActionLogs(req.params.action);
            return res.status(200).json({ 
                status: "Y", 
                message: "Action logs retrieved successfully", 
                data: logs 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

module.exports = router;