const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require("../middleware/auth.middleware");

// Dashboard controller functions
const { 
    getDashboardStats,
    getDashboardCharts,
    getRecentActivities
} = require("../controller/dashboard");

// Get dashboard statistics - admin and recruiter only
router.get("/stats", 
    authenticateJWT,
    authorizeRoles("admin", "recruiter"),
    getDashboardStats
);

// Get dashboard charts data - admin and recruiter only
router.get("/charts", 
    authenticateJWT,
    authorizeRoles("admin", "recruiter"),
    getDashboardCharts
);

// Get recent activities - admin and recruiter only
router.get("/recent-activities", 
    authenticateJWT,
    authorizeRoles("admin", "recruiter"),
    getRecentActivities
);

// Get personalized dashboard for user role
router.get("/personalized", 
    authenticateJWT,
    async (req, res) => {
        try {
            // Different dashboard data based on user role
            const userRole = req.user.role;
            
            if (userRole === "admin" || userRole === "recruiter") {
                // Return full dashboard data
                const stats = await require("../controller/dashboard").getDashboardStats(req, res);
                const charts = await require("../controller/dashboard").getDashboardCharts(req, res);
                const activities = await require("../controller/dashboard").getRecentActivities(req, res);
                
                return res.status(200).json({ 
                    status: "Y", 
                    message: "Personalized dashboard data retrieved", 
                    data: {
                        stats,
                        charts,
                        activities,
                        role: userRole
                    }
                });
            } else if (userRole === "interviewer") {
                // Return interviewer-specific data
                return res.status(200).json({ 
                    status: "Y", 
                    message: "Interviewer dashboard data", 
                    data: {
                        upcomingInterviews: [], // Would be populated by service
                        scheduledFeedback: [], // Would be populated by service
                        role: userRole
                    }
                });
            } else if (userRole === "candidate") {
                // Return candidate-specific data
                return res.status(200).json({ 
                    status: "Y", 
                    message: "Candidate dashboard data", 
                    data: {
                        appliedJobs: [], // Would be populated by service
                        interviewSchedule: [], // Would be populated by service
                        applicationStatus: [], // Would be populated by service
                        role: userRole
                    }
                });
            } else {
                return res.status(403).json({ 
                    status: "N", 
                    error: "Unauthorized role" 
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

module.exports = router;