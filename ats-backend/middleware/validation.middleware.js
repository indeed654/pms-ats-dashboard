const { authSchemas, candidateSchemas, jobSchemas, interviewSchemas, documentSchemas } = require('../validation/schemas');

// Generic validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { 
            abortEarly: false,
            stripUnknown: true
        });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                status: "N",
                error: "Validation Error",
                message: errorMessage
            });
        }
        
        // Update req.body with validated data
        req.body = value;
        next();
    };
};

// Validation middleware for different routes
const validationMiddleware = {
    // Authentication
    signup: validate(authSchemas.signup),
    login: validate(authSchemas.login),
    
    // Candidates
    createCandidate: validate(candidateSchemas.create),
    updateCandidate: validate(candidateSchemas.update),
    
    // Jobs
    createJob: validate(jobSchemas.create),
    updateJob: validate(jobSchemas.update),
    
    // Interviews
    createInterview: validate(interviewSchemas.create),
    updateInterview: validate(interviewSchemas.update),
    
    // Documents
    uploadDocument: validate(documentSchemas.upload)
};

module.exports = validationMiddleware;