const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

// Controller functions (these will be moved to services later)
const candidateService = require("../services/candidate.service");

// Create candidate - admin and recruiter only
router.post("/", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    validationMiddleware.createCandidate,
    async (req, res) => {
        try {
            const candidate = await candidateService.createCandidate(req.body, req.user.userId);
            return res.status(201).json({ 
                status: "Y", 
                message: "Candidate created successfully", 
                data: candidate 
            });
        } catch (error) {
            return res.status(400).json({ 
                status: "N", 
                error: error.message 
            });
        }
    }
);

// Get all candidates - admin and recruiter only
router.get("/", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            const candidates = await candidateService.getAllCandidates(req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Candidates retrieved successfully", 
                data: candidates 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Get candidate by ID - admin and recruiter only
router.get("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            const candidate = await candidateService.getCandidateById(req.params.id, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Candidate retrieved successfully", 
                data: candidate 
            });
        } catch (error) {
            if (error.message === "Candidate not found") {
                return res.status(404).json({ 
                    status: "N", 
                    message: "Candidate not found" 
                });
            }
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Update candidate - admin and recruiter only
router.put("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    validationMiddleware.updateCandidate,
    async (req, res) => {
        try {
            const candidate = await candidateService.updateCandidate(req.params.id, req.body, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Candidate updated successfully", 
                data: candidate 
            });
        } catch (error) {
            if (error.message === "Candidate not found") {
                return res.status(404).json({ 
                    status: "N", 
                    message: "Candidate not found" 
                });
            }
            return res.status(400).json({ 
                status: "N", 
                error: error.message 
            });
        }
    }
);

// Delete candidate - admin and recruiter only
router.delete("/:id", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            await candidateService.deleteCandidate(req.params.id, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Candidate deleted successfully" 
            });
        } catch (error) {
            if (error.message === "Candidate not found") {
                return res.status(404).json({ 
                    status: "N", 
                    message: "Candidate not found" 
                });
            }
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Move candidate to next stage - admin and recruiter only
router.patch("/:id/move-stage", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            const { newStatus, notes } = req.body;
            const candidate = await candidateService.moveCandidateStage(
                req.params.id, 
                newStatus, 
                req.user.userId, 
                notes
            );
            return res.status(200).json({ 
                status: "Y", 
                message: "Candidate stage updated successfully", 
                data: candidate 
            });
        } catch (error) {
            if (error.message === "Candidate not found") {
                return res.status(404).json({ 
                    status: "N", 
                    message: "Candidate not found" 
                });
            }
            return res.status(400).json({ 
                status: "N", 
                error: error.message 
            });
        }
    }
);

// Get candidates by status - admin and recruiter only
router.get("/status/:status", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            const candidates = await candidateService.getCandidatesByStatus(req.params.status, req.user.userId);
            return res.status(200).json({ 
                status: "Y", 
                message: "Candidates retrieved successfully", 
                data: candidates 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "N", 
                error: "Internal error!" 
            });
        }
    }
);

// Get candidate statistics - admin and recruiter only
router.get("/stats/overview", 
    authenticateJWT, 
    authorizeRoles("admin", "recruiter"),
    async (req, res) => {
        try {
            const stats = await candidateService.getCandidateStats(req.user.userId);
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