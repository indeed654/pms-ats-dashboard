const Interview = require("../models/Interview.Model");

//////////////////////////////////////////////////////////////////////////////////
exports.createInterview = async (req, res)=>{
    try{
        const{ candidateId, jobId, interviewerId, scheduleDateTime, duration, type, status } = req.body;
        if(!candidateId || !jobId || !interviewerId || !scheduleDateTime || !duration || !type){
            return res.status(400).json({status:"N", error:"All required fields are required"});
        }
        const newInterview = await Interview.create({
            candidateId,
            jobId,
            interviewerId,
            scheduleDateTime,
            duration,
            type,
            status: status || 'scheduled',
            createdBy: req.user ? req.user.userId : null
        });
        return res.status(201).json({status:"Y", message:"Interview created successfully", data: newInterview});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};
///////////////////////////////////////////////////////////////////////////////////
exports.getInterviews = async(req, res)=>{
    try{
        const interviews = await Interview.findAll({
            where: { isDeleted: false }
        });
        if(!interviews || interviews.length === 0){
            return res.status(404).json({status:"N", message:"No Interviews found"});
        }
        return res.status(200).json({status:"Y", message:"Interviews retrieved successfully", data: interviews});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

exports.getInterviewById = async(req, res)=>{
    try{
        const { id } = req.params;
        const interview = await Interview.findByPk(id);
        if(!interview || interview.isDeleted){
            return res.status(404).json({status:"N", message:"Interview not found"});
        }
        return res.status(200).json({status:"Y", message:"Interview retrieved successfully", data: interview});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

exports.getInterviewsByCandidate = async(req, res)=>{
    try{
        const { candidateId } = req.params;
        const interviews = await Interview.findAll({
            where: { candidateId, isDeleted: false }
        });
        if(!interviews || interviews.length === 0){
            return res.status(404).json({status:"N", message:"No Interviews found for this candidate"});
        }
        return res.status(200).json({status:"Y", message:"Interviews retrieved successfully", data: interviews});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

exports.getInterviewsByJob = async(req, res)=>{
    try{
        const { jobId } = req.params;
        const interviews = await Interview.findAll({
            where: { jobId, isDeleted: false }
        });
        if(!interviews || interviews.length === 0){
            return res.status(404).json({status:"N", message:"No Interviews found for this job"});
        }
        return res.status(200).json({status:"Y", message:"Interviews retrieved successfully", data: interviews});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

////////////////////////////////////////////////////////////////////////////////////////
exports.deleteInterview = async (req, res) => {
    let id = req.params.id;
    try{
        const interview = await Interview.findByPk(id);
        if(!interview || interview.isDeleted){
            return res.status(404).json({status:"N",message:"Interview not found"});
        }
        await Interview.update(
            { isDeleted: true },
            { where: { id: id } }
        );
        return res.status(200).json({status:"Y",message:"Interview Deleted Successfully!"});
    }catch(error){
        return res.status(500).json({status:"N", error:`Internal Error: ${error}`});

    }
};
/////////////////////////////////////////////////////////////////////////////////////////////
exports.updateInterview = async (req, res)=>{
    let id = req.params.id;
    try{
        const { scheduleDateTime, duration, status, feedback, notes } = req.body;
        const interview = await Interview.findByPk(id);
        if(!interview || interview.isDeleted){
            return res.status(404).json({status:"N", message:"Interview not found"});
        }
        await Interview.update({
            scheduleDateTime,
            duration,
            status,
            feedback,
            notes,
            updatedBy: req.user ? req.user.userId : null
        }, { where: { id: id } });
        const updatedInterview = await Interview.findByPk(id);
        return res.status(200).json({status:"Y", message:"Interview updated successfully", data: updatedInterview});
    }catch(error){
        console.log(error);
        return res.status(500).json({status:"N",error:`Internal Error: ${error}`});
    }
};
