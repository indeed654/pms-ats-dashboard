const Job = require("../models/Job.Model"); // Updated to use Sequelize model
const activityLogger = require("./activity.service");

class JobService {
    // Create new job
    async createJob(jobData, userId) {
        try {
            const { title, description, department, location, type, salary, requirements, status } = jobData;
            
            const newJob = await Job.create({
                title,
                description,
                department,
                location,
                type,
                salary_min: (salary && salary.min) || 0,
                salary_max: (salary && salary.max) || 0,
                salary_currency: (salary && salary.currency) || 'USD',
                requirements: requirements || [],
                status: status || 'draft',
                postedBy: userId,
                postedDate: new Date()
            });
            
            // Log activity
            await activityLogger.logActivity(
                userId, 
                'CREATE', 
                'job', 
                newJob.id.toString(), 
                { 
                    title: newJob.title, 
                    department: newJob.department,
                    status: newJob.status 
                }
            );
            
            return newJob;
        } catch (error) {
            throw error;
        }
    }
    
    // Get all jobs
    async getAllJobs(userId) {
        try {
            const jobs = await Job.findAll({ 
                where: { isDeleted: false }
            });
            
            // Log activity
            await activityLogger.logActivity(userId, 'READ', 'job', 'all', {});
            
            return jobs;
        } catch (error) {
            throw error;
        }
    }
    
    // Get job by ID
    async getJobById(jobId, userId) {
        try {
            const job = await Job.findByPk(jobId);
            
            if (!job || job.isDeleted) {
                throw new Error("Job not found");
            }
            
            // Log activity
            await activityLogger.logActivity(userId, 'READ', 'job', jobId, {});
            
            return job;
        } catch (error) {
            throw error;
        }
    }
    
    // Update job
    async updateJob(jobId, updateData, userId) {
        try {
            const job = await Job.findByPk(jobId);
            
            if (!job || job.isDeleted) {
                throw new Error("Job not found");
            }
            
            await Job.update(
                { ...updateData, updatedBy: userId },
                { where: { id: jobId } }
            );
            
            const updatedJob = await Job.findByPk(jobId);
            
            // Log activity
            await activityLogger.logActivity(
                userId, 
                'UPDATE', 
                'job', 
                jobId, 
                { updates: Object.keys(updateData) }
            );
            
            return updatedJob;
        } catch (error) {
            throw error;
        }
    }
    
    // Delete job (soft delete)
    async deleteJob(jobId, userId) {
        try {
            const job = await Job.findByPk(jobId);
            
            if (!job || job.isDeleted) {
                throw new Error("Job not found");
            }
            
            await Job.update(
                { isDeleted: true, updatedBy: userId },
                { where: { id: jobId } }
            );
            
            // Log activity
            await activityLogger.logActivity(userId, 'DELETE', 'job', jobId, {});
            
            return { message: "Job deleted successfully" };
        } catch (error) {
            throw error;
        }
    }
    
    // Get active jobs
    async getActiveJobs(userId) {
        try {
            const jobs = await Job.findAll({ 
                where: { status: 'active', isDeleted: false }
            });
            
            // Log activity
            await activityLogger.logActivity(userId, 'READ', 'job', 'active', {});
            
            return jobs;
        } catch (error) {
            throw error;
        }
    }
    
    // Get jobs by department
    async getJobsByDepartment(department, userId) {
        try {
            const jobs = await Job.findAll({ 
                where: { department, isDeleted: false }
            });
            
            // Log activity
            await activityLogger.logActivity(userId, 'READ', 'job', `department:${department}`, {});
            
            return jobs;
        } catch (error) {
            throw error;
        }
    }
    
    // Get job statistics
    async getJobStats(userId) {
        try {
            const jobs = await Job.findAll({ 
                where: { isDeleted: false }
            });
            
            // Calculate statistics manually since MySQL doesn't support aggregation like MongoDB
            const byStatus = {
                draft: 0,
                active: 0,
                paused: 0,
                closed: 0
            };
            
            const byDepartment = {};
            const byType = {
                'full-time': 0,
                'part-time': 0,
                contract: 0,
                internship: 0
            };
            
            jobs.forEach(job => {
                byStatus[job.status] = (byStatus[job.status] || 0) + 1;
                byDepartment[job.department] = (byDepartment[job.department] || 0) + 1;
                byType[job.type] = (byType[job.type] || 0) + 1;
            });
            
            const total = jobs.length;
            const active = jobs.filter(job => job.status === 'active').length;
            const closed = jobs.filter(job => job.status === 'closed').length;
            
            return {
                total,
                active,
                closed,
                byDepartment,
                byType
            };
        } catch (error) {
            throw error;
        }
    }
    
    // Close job
    async closeJob(jobId, userId) {
        try {
            const job = await this.getJobById(jobId, userId);
            
            if (job.status === 'closed') {
                throw new Error("Job is already closed");
            }
            
            const updatedJob = await this.updateJob(
                jobId, 
                { status: 'closed', closedDate: new Date() }, 
                userId
            );
            
            // Log activity
            await activityLogger.logActivity(
                userId, 
                'UPDATE', 
                'job', 
                jobId, 
                { action: 'close' }
            );
            
            return updatedJob;
        } catch (error) {
            throw error;
        }
    }
    
    // Get jobs posted by user
    async getJobsByUser(postedBy, userId) {
        try {
            const jobs = await Job.findAll({ 
                where: { postedBy, isDeleted: false }
            });
            
            // Log activity
            await activityLogger.logActivity(userId, 'READ', 'job', `user:${postedBy}`, {});
            
            return jobs;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new JobService();
