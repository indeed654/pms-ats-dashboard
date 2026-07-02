const ActivityLog = require("../models/ActivityLog.Model");

//////////////////////////////////////////////////////////////////////////////////
exports.createActivityLog = async (req, res)=>{
    try{
        const{ title, company, candidate, action, status } = req.body;
        if(!title || !company || !candidate || !action || !status){
            return res.status(400).json({status:"N", error:"All fields are required"});
        }
        const newActivityLog = new ActivityLog({
            title,
            company,
            candidate,
            action,
            status,
        });
        await newActivityLog.save();
        return res.status(201).json({status:"Y", message:"Activity log created successfully", data: newActivityLog})
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};
///////////////////////////////////////////////////////////////////////////////////
exports.getActivityLog = async(req, res)=>{
    try{
        const activitylog = await ActivityLog.find();
        if(!activitylog || activitylog.length === 0){
            return res.status(404).json({status:"N", message:"No activitylog found"});
        }
        return res.status(200).json({status:"Y", message:"Activity logs retrieved successfully", data: activitylog})
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

////////////////////////////////////////////////////////////////////////////////////////
exports.deleteActivityLog = async (req, res) => {
    let id = req.params.id;
    try{
        const activitylog = await ActivityLog.findByIdAndDelete(id);
        if(!activitylog){
            return res.status(404).json({status:"N",message:"Activity log not found"});
        }
        return res.status(200).json({status:"Y",message:"activitylog Deleted Successfully!"});
    }catch(error){
        return res.status(500).json({status:"N", error:`Internal Error: ${error}`});

    }
};
/////////////////////////////////////////////////////////////////////////////////////////////
exports.updateActivityLog = async (req, res)=>{
    let id = req.params.id;
    try{
        const {title, company, candidate, action, status} = req.body;
        if(!title || !company || !candidate || !action || !status){
            return res.status(400).json({status:"N", error:"All fields are required"});
        }
        const activitylog = await ActivityLog.findById(id);
        if(!activitylog){
            return res.status(404).json({status:"N", message:"Activity log not found"});
        }
        const updateActivityLog= await ActivityLog.findByIdAndUpdate(id,{
            title,
            company,
            candidate,
            action,
            status,
            
        });
        return res.status(200).json({status:"Y", message:"Activity log updated successfully", data: updateActivityLog});
    }catch(error){        console.log(error);        return res.status(500).json({status:"N",error:`Internal Error: ${error}`});
    }
};