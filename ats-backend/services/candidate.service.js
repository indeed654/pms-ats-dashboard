const Candidate = require("../models/Candidate.Model"); // Updated to use Sequelize model
const activityLogger = require("./activity.service");

class CandidateService {
    // Create new candidate
    async createCandidate(candidateData, userId) {
        try {
            const { name, email, phone, skills, experience, status, source } = candidateData;
            
            // Check if candidate already exists
            const existingCandidate = await this.findCandidateByEmail(email);
            if (existingCandidate) {
                throw new Error("Candidate with this email already exists");
            }
            
            // Create new candidate
            const newCandidate = await Candidate.create({
                name,
                email,
                phone,
                skills,
                experience: experience || 0,
                status: status || 'applied',
                appliedDate: new Date(),
                source: source || 'career_page',
                createdBy: userId
            });
            
            // Log activity
            await activityLogger.logActivity(
                userId, 
                'CREATE', 
                'candidate', 
                newCandidate.id.toString(), 
                { 
                    name: newCandidate.name, 
                    email: newCandidate.email,
                    status: newCandidate.status 
                }
            );
            
            return newCandidate;
        } catch (error) {
            throw error;
        }
    }
    
    // Get all candidates
    async getAllCandidates(userId) {
        try {
            const candidates = await Candidate.findAll({ 
                where: { isDeleted: false }
            });
            
            // Log activity
            await activityLogger.logActivity(userId, 'READ', 'candidate', 'all', {});
            
            return candidates;
        } catch (error) {
            throw error;
        }
    }
    
    // Get candidate by ID
    async getCandidateById(candidateId, userId) {
        try {
            const candidate = await Candidate.findByPk(candidateId);
            
            if (!candidate || candidate.isDeleted) {
                throw new Error("Candidate not found");
            }
            
            // Log activity
            await activityLogger.logActivity(userId, 'READ', 'candidate', candidateId, {});
            
            return candidate;
        } catch (error) {
            throw error;
        }
    }
    
    // Update candidate
    async updateCandidate(candidateId, updateData, userId) {
        try {
            const candidate = await Candidate.findByPk(candidateId);
            
            if (!candidate || candidate.isDeleted) {
                throw new Error("Candidate not found");
            }
            
            await Candidate.update(
                { ...updateData, updatedBy: userId },
                { where: { id: candidateId } }
            );
            
            const updatedCandidate = await Candidate.findByPk(candidateId);
            
            // Log activity
            await activityLogger.logActivity(
                userId, 
                'UPDATE', 
                'candidate', 
                candidateId, 
                { updates: Object.keys(updateData) }
            );
            
            return updatedCandidate;
        } catch (error) {
            throw error;
        }
    }
    
    // Delete candidate (soft delete)
    async deleteCandidate(candidateId, userId) {
        try {
            const candidate = await Candidate.findByPk(candidateId);
            
            if (!candidate || candidate.isDeleted) {
                throw new Error("Candidate not found");
            }
            
            await Candidate.update(
                { isDeleted: true, updatedBy: userId },
                { where: { id: candidateId } }
            );
            
            // Log activity
            await activityLogger.logActivity(userId, 'DELETE', 'candidate', candidateId, {});
            
            return { message: "Candidate deleted successfully" };
        } catch (error) {
            throw error;
        }
    }
    
    // Find candidate by email
    async findCandidateByEmail(email) {
        try {
            return await Candidate.findOne({ 
                where: { email, isDeleted: false }
            });
        } catch (error) {
            throw error;
        }
    }
    
    // Move candidate to next stage
    async moveCandidateStage(candidateId, newStatus, userId, notes = '') {
        try {
            const candidate = await this.getCandidateById(candidateId, userId);
            
            const validStatuses = ['applied', 'shortlisted', 'interview', 'hired', 'rejected'];
            const currentIndex = validStatuses.indexOf(candidate.status);
            const newIndex = validStatuses.indexOf(newStatus);
            
            // Ensure we're moving forward or staying in same stage
            if (newIndex < currentIndex) {
                throw new Error("Cannot move candidate to a previous stage");
            }
            
            const updatedCandidate = await this.updateCandidate(
                candidateId, 
                { status: newStatus }, 
                userId
            );
            
            // Log activity
            await activityLogger.logActivity(
                userId, 
                'UPDATE', 
                'candidate', 
                candidateId, 
                { 
                    from: candidate.status, 
                    to: newStatus,
                    notes: notes 
                }
            );
            
            return updatedCandidate;
        } catch (error) {
            throw error;
        }
    }
    
    // Get candidates by status
    async getCandidatesByStatus(status, userId) {
        try {
            const candidates = await Candidate.findAll({ 
                where: { status, isDeleted: false }
            });
            
            // Log activity
            await activityLogger.logActivity(userId, 'READ', 'candidate', `status:${status}`, {});
            
            return candidates;
        } catch (error) {
            throw error;
        }
    }
    
    // Get candidate statistics
    async getCandidateStats(userId) {
        try {
            const candidates = await Candidate.findAll({ 
                where: { isDeleted: false }
            });
            
            // Calculate statistics manually since MySQL doesn't support aggregation like MongoDB
            const byStatus = {
                applied: 0,
                shortlisted: 0,
                interview: 0,
                hired: 0,
                rejected: 0
            };
            
            const bySource = {
                linkedin: 0,
                referral: 0,
                career_page: 0,
                job_board: 0
            };
            
            candidates.forEach(candidate => {
                byStatus[candidate.status] = (byStatus[candidate.status] || 0) + 1;
                bySource[candidate.source] = (bySource[candidate.source] || 0) + 1;
            });
            
            const total = candidates.length;
            
            return {
                total,
                byStatus,
                bySource
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CandidateService();
