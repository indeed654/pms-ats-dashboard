const Job = require("../models/Job.Model");

//////////////////////////////////////////////////////////////////////////////////
exports.createJob = async (req, res)=>{
    try{
        const{ title, description, department, location, type, requirements, status } = req.body;
        if(!title || !description || !department || !location || !type || !requirements || !status){
            return res.status(400).json({status:"N", error:"All fields are required"});
        }
        const newJob = await Job.create({
            title,
            description,
            department,
            location,
            type,
            requirements,
            status,
        });
        return res.status(201).json({status:"Y", message:"Job created successfully", data: newJob});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};
///////////////////////////////////////////////////////////////////////////////////
exports.getJob = async(req, res)=>{
    try{
        const jobs = await Job.findAll({
            where: { isDeleted: false }
        });
        if(!jobs || jobs.length === 0){
            return res.status(404).json({status:"N", message:"No jobs found"});
        }
        return res.status(200).json({status:"Y", message:"Jobs retrieved successfully", data: jobs});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

////////////////////////////////////////////////////////////////////////////////////////
exports.deleteJob = async (req, res) => {
    let id = req.params.id;
    try{
        const job = await Job.findByPk(id);
        if(!job || job.isDeleted){
            return res.status(404).json({status:"N",message:"Job not found"});
        }
        await Job.update(
            { isDeleted: true },
            { where: { id: id } }
        );
        return res.status(200).json({status:"Y",message:"Job Deleted Successfully!"});
    }catch(error){
        return res.status(500).json({status:"N", error:`Internal Error: ${error}`});

    }
};

/////////////////////////////////////////////////////////////////////////////////////////////
exports.updateJob = async (req, res)=>{
    let id = req.params.id;
    try{
        const { title, description, department, location, type, requirements, status } = req.body;
        if(!title || !description || !department || !location || !type || !requirements || !status){
            return res.status(400).json({status:"N", error:"All fields are required"});
        }
        const job = await Job.findByPk(id);
        if(!job || job.isDeleted){
            return res.status(404).json({status:"N", message:"Job not found"});
        }
        await Job.update({
            title,
            description,
            department,
            location,
            type,
            requirements,
            status,
        }, { where: { id: id } });
        const updatedJob = await Job.findByPk(id);
        return res.status(200).json({status:"Y", message:"Job updated successfully", data: updatedJob});
    }catch(error){
        console.log(error);
        return res.status(500).json({status:"N",error:`Internal Error: ${error}`});
    }
};
