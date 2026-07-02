const Candidate = require("../models/Candidate.Model");
const Job = require("../models/Job.Model");
const Interview = require("../models/Interview.Model");
const ActivityLog = require("../models/ActivityLog.Model");

//////////////////////////////////////////////////////////////////////////////////
exports.getDashboardStats = async (req, res) => {
    try {
        const totalCandidates = await Candidate.count({
            where: { isDeleted: false }
        });
        const totalJobs = await Job.count({
            where: { isDeleted: false }
        });
        const totalInterviews = await Interview.count({
            where: { isDeleted: false }
        });
        const totalActivities = await ActivityLog.count();
        
        return res.status(200).json({
            status: "Y",
            message: "Dashboard stats retrieved successfully",
            data: {
                totalCandidates,
                totalJobs,
                totalInterviews,
                totalActivities
            }
        });
    } catch (error) {
        return res.status(500).json({ status: "N", error: "Internal error!" });
    }
};

///////////////////////////////////////////////////////////////////////////////////
exports.getDashboardCharts = async (req, res) => {
    try {
        // Sample chart data - in real application this would be calculated from actual data
        const chartData = {
            applicationsPerMonth: [
                { month: 'Jan', count: 10 },
                { month: 'Feb', count: 15 },
                { month: 'Mar', count: 12 },
                { month: 'Apr', count: 20 },
                { month: 'May', count: 18 },
                { month: 'Jun', count: 25 }
            ],
            candidatesByStatus: [
                { status: 'Applied', count: 45 },
                { status: 'Shortlisted', count: 20 },
                { status: 'Interview', count: 15 },
                { status: 'Hired', count: 8 },
                { status: 'Rejected', count: 12 }
            ],
            jobsByDepartment: [
                { department: 'Engineering', count: 12 },
                { department: 'Marketing', count: 8 },
                { department: 'Sales', count: 6 },
                { department: 'HR', count: 4 }
            ]
        };
        
        return res.status(200).json({
            status: "Y",
            message: "Dashboard chart data retrieved successfully",
            data: chartData
        });
    } catch (error) {
        return res.status(500).json({ status: "N", error: "Internal error!" });
    }
};

////////////////////////////////////////////////////////////////////////////////////////
exports.getRecentActivities = async (req, res) => {
    try {
        const recentActivities = await ActivityLog.findAll({
            order: [['timestamp', 'DESC']],
            limit: 10
        });
        
        return res.status(200).json({
            status: "Y",
            message: "Recent activities retrieved successfully",
            data: recentActivities
        });
    } catch (error) {
        return res.status(500).json({ status: "N", error: "Internal error!" });
    }
};
