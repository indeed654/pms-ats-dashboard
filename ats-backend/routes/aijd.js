const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require("../middleware/auth.middleware");

// AI JD controller functions
const { 
    generateJobDescription,
    getGeneratedJDs,
    getJDById,
    deleteJD
} = require("../controller/aijd");

// Generate job description - admin and recruiter only
router.post("/", 
    authenticateJWT,
    authorizeRoles("admin", "recruiter"),
    generateJobDescription
);

// Get all generated JDs - admin and recruiter only
router.get("/", 
    authenticateJWT,
    authorizeRoles("admin", "recruiter"),
    getGeneratedJDs
);

// Get specific JD - admin and recruiter only
router.get("/:id", 
    authenticateJWT,
    authorizeRoles("admin", "recruiter"),
    getJDById
);

// Delete JD - admin and recruiter only
router.delete("/:id", 
    authenticateJWT,
    authorizeRoles("admin", "recruiter"),
    deleteJD
);

module.exports = router;