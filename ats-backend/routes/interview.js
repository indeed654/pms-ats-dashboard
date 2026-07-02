const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

// Interview controller functions (to be moved to service)
const { 
    createInterview, 
    getInterviews, 
    getInterviewById, 
    updateInterview, 
    deleteInterview 
} = require("../controller/interview");

// Create interview - admin and recruiter only
router.post("/", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    validationMiddleware.createInterview,
    createInterview
);

// Get all interviews - admin, recruiter, and assigned interviewer
router.get("/", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter", "interviewer"),
    getInterviews
);

// Get interview by ID - admin, recruiter, and assigned interviewer only
router.get("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter", "interviewer"),
    getInterviewById
);

// Update interview - admin, recruiter, and assigned interviewer only
router.put("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter", "interviewer"),
    validationMiddleware.updateInterview,
    updateInterview
);

// Delete interview - admin and recruiter only
router.delete("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    deleteInterview
);

// Get interviews by candidate - admin, recruiter, and assigned interviewer
router.get("/candidate/:candidateId", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter", "interviewer"),
    async (req, res) => {
        try {
            // This would be implemented in the service
            const { getInterviewsByCandidate } = require("../controller/interview");
            await getInterviewsByCandidate(req, res);
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Get interviews by job - admin, recruiter, and assigned interviewer
router.get("/job/:jobId", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter", "interviewer"),
    async (req, res) => {
        try {
            // This would be implemented in the service
            const { getInterviewsByJob } = require("../controller/interview");
            await getInterviewsByJob(req, res);
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

module.exports = router;