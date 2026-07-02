const Joi = require('joi');

// Authentication validation schemas
const authSchemas = {
    signup: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'recruiter', 'interviewer', 'candidate').required(),
        createdAt: Joi.date().required()
    }),

    login: Joi.object({
        email: Joi.string().email({ tlds: { allow: ['com', 'net', 'org', 'local', 'io'] } }).required(),
        password: Joi.string().required()
    })
};

// Candidate validation schemas
const candidateSchemas = {
    create: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required(),
        skills: Joi.array().items(Joi.string()).min(1).required(),
        experience: Joi.number().min(0).max(50),
        status: Joi.string().valid('applied', 'shortlisted', 'interview', 'hired', 'rejected').required(),
        appliedDate: Joi.date(),
        source: Joi.string().valid('linkedin', 'referral', 'career_page', 'job_board')
    }),

    update: Joi.object({
        name: Joi.string().min(2).max(100),
        email: Joi.string().email(),
        phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/),
        skills: Joi.array().items(Joi.string()).min(1),
        experience: Joi.number().min(0).max(50),
        status: Joi.string().valid('applied', 'shortlisted', 'interview', 'hired', 'rejected')
    })
};

// Job validation schemas
const jobSchemas = {
    create: Joi.object({
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().min(20).max(5000).required(),
        department: Joi.string().min(2).max(50).required(),
        location: Joi.string().min(2).max(100).required(),
        type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').required(),
        salary: Joi.object({
            min: Joi.number().positive().required(),
            max: Joi.number().positive().required(),
            currency: Joi.string().valid('USD', 'EUR', 'GBP').default('USD')
        }).required(),
        requirements: Joi.array().items(Joi.string()).min(1).required(),
        status: Joi.string().valid('active', 'closed', 'paused', 'draft').default('draft')
    }),

    update: Joi.object({
        title: Joi.string().min(5).max(100),
        description: Joi.string().min(20).max(5000),
        department: Joi.string().min(2).max(50),
        location: Joi.string().min(2).max(100),
        type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship'),
        salary: Joi.object({
            min: Joi.number().positive(),
            max: Joi.number().positive(),
            currency: Joi.string().valid('USD', 'EUR', 'GBP')
        }),
        requirements: Joi.array().items(Joi.string()).min(1),
        status: Joi.string().valid('active', 'closed', 'paused', 'draft')
    })
};

// Interview validation schemas
const interviewSchemas = {
    create: Joi.object({
        candidateId: Joi.string().required(),
        jobId: Joi.string().required(),
        interviewerId: Joi.string().required(),
        scheduleDateTime: Joi.date().min('now').required(),
        duration: Joi.number().min(15).max(240).required(),
        type: Joi.string().valid('technical', 'hr', 'behavioral', 'final').required(),
        location: Joi.string().max(200),
        meetingLink: Joi.string().uri().when('type', {
            is: 'technical',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        notes: Joi.string().max(1000)
    }),

    update: Joi.object({
        scheduleDateTime: Joi.date().min('now'),
        duration: Joi.number().min(15).max(240),
        status: Joi.string().valid('scheduled', 'completed', 'cancelled', 'rescheduled'),
        feedback: Joi.object({
            rating: Joi.number().min(1).max(5),
            comments: Joi.string().max(1000),
            recommendation: Joi.string().valid('hire', 'reject', 'consider')
        }),
        notes: Joi.string().max(1000)
    })
};

// Document validation schemas
const documentSchemas = {
    upload: Joi.object({
        candidateId: Joi.string().required(),
        type: Joi.string().valid('resume', 'cover_letter', 'portfolio', 'certificate', 'other').required(),
        fileName: Joi.string().required(),
        fileSize: Joi.number().positive().max(10 * 1024 * 1024), // 10MB max
        mimeType: Joi.string().valid('application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png').required()
    })
};

module.exports = {
    authSchemas,
    candidateSchemas,
    jobSchemas,
    interviewSchemas,
    documentSchemas
};
