const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRoles, authorizeSelf } = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

// Document controller functions
const { 
    uploadDocument, 
    getDocuments, 
    getDocumentById, 
    deleteDocument 
} = require("../controller/document");

// Upload document - authenticated users only
router.post("/", 
    authenticateJWT,
    uploadDocument
);

// Get documents - candidate can see own docs, admin/recruiter can see all
router.get("/", 
    authenticateJWT,
    getDocuments
);

// Get document by ID - candidate can see own doc, admin/recruiter can see any
router.get("/:id", 
    authenticateJWT,
    getDocumentById
);

// Delete document - candidate can delete own doc, admin/recruiter can delete any
router.delete("/:id", 
    authenticateJWT,
    deleteDocument
);

module.exports = router;