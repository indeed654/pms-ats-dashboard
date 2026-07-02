const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");
const jobService = require("../services/job.service");

// Create job - admin and recruiter only
router.post("/", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    validationMiddleware.createJob,
    async (req, res) => {
        try {
            const job = await jobService.createJob(req.body, req.user.userId);
            return res.status(201).json({ 
                status: "Y", 
                message: "Job created successfully", 
                data: job 
            });
        } catch (error) {
            return res.status(400).json({ 
                status: "N", 
                error: error.message 
            });
        }
    }
);

// Get all jobs - admin, recruiter, and interviewer can view
router.get("/", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter", "interviewer"),
    async (req, res) => {
        try {
            const jobs = await jobService.getAllJobs(req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Jobs retrieved successfully", 
                data: jobs 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Get job by ID - admin, recruiter, and interviewer can view
router.get("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter", "interviewer"),
    async (req, res) => {
        try {
            const job = await jobService.getJobById(req.params.id, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Job retrieved successfully", 
                data: job 
            });
        } catch (error) {
            if (error.message === "Job not found") {
                return res.status(404).json({ 
                    status: "N", 
                    message: "Job not found" 
                });
            }
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Update job - admin and recruiter only
router.put("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    validationMiddleware.updateJob,
    async (req, res) => {
        try {
            const job = await jobService.updateJob(req.params.id, req.body, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Job updated successfully", 
                data: job 
            });
        } catch (error) {
            if (error.message === "Job not found") {
                return res.status(404).json({ 
                    status: "N", 
                    message: "Job not found" 
                });
            }
            return res.status(400).json({ 
                status: "N", 
                error: error.message 
            });
        }
    }
);

// Delete job - admin and recruiter only
router.delete("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            await jobService.deleteJob(req.params.id, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Job deleted successfully" 
            });
        } catch (error) {
            if (error.message === "Job not found") {
                return res.status(404).json({ 
                    status: "N", 
                    message: "Job not found" 
                });
            }
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Get active jobs - public endpoint for candidates
router.get("/public/active", async (req, res) => {
    try {
        const jobs = await jobService.getActiveJobs("public");
        return res.status(200).json({ 
            status: "Y", 
            message: "Active jobs retrieved successfully", 
            data: jobs 
        });
    } catch (error) {
        return res.status(500).json({ 
            status: "N", 
            error: "Internal error!" 
        });
    }
});

// Get jobs by department - admin and recruiter only
router.get("/department/:department", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            const jobs = await jobService.getJobsByDepartment(req.params.department, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Jobs retrieved successfully", 
                data: jobs 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Close job - admin and recruiter only
router.patch("/:id/close", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            const job = await jobService.closeJob(req.params.id, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Job closed successfully", 
                data: job 
            });
        } catch (error) {
            if (error.message === "Job not found") {
                return res.status(404).json({ 
                    status: "N", 
                    message: "Job not found" 
                });
            }
            return res.status(400).json({ 
                status: "N", 
                error: error.message 
            });
        }
    }
);

// Get job statistics - admin and recruiter only
router.get("/stats/overview", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            const stats = await jobService.getJobStats(req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Statistics retrieved successfully", 
                data: stats 
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