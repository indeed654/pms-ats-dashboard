const AIJD = require("../models/AI-JD.Model");

exports.generateJobDescription = async (req, res)=>{
    try{
        const{title, description, requirements, prompt} = req.body;
        if(!title || !description || !requirements || !prompt){
            return res.status(400).json({status:"N", error:"All required fields are required"});
        }
        const newJD = await AIJD.create({
            title,
            description,
            requirements,
            prompt,
            generatedBy: req.user ? req.user.userId : null
        });
        return res.status(201).json({status:"Y", message:"Job Description generated successfully", data: newJD});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

exports.getGeneratedJDs = async(req, res)=>{
    try{
        const jds = await AIJD.findAll({
            where: { isDeleted: false }
        });
        if(!jds || jds.length === 0){
            return res.status(404).json({status:"N", message:"No Job Descriptions found"});
        }
        return res.status(200).json({status:"Y", message:"Job Descriptions retrieved successfully", data: jds});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

// No need for update function for AI-JD since it's typically not updated after generation
// But if needed, here's a placeholder:
exports.getJDById = async (req, res) => {
    let id = req.params.id;
    try{
        const jd = await AIJD.findByPk(id);
        if(!jd || jd.isDeleted){
            return res.status(404).json({status:"N",message:"Job Description not found"});
        }
        return res.status(200).json({status:"Y",message:"Job Description retrieved successfully", data: jd});
    }catch(error){
        return res.status(500).json({status:"N", error:`Internal Error: ${error}`});

    }
};

exports.deleteJD = async (req, res) => {
    let id = req.params.id;
    try{
        const jd = await AIJD.findByPk(id);
        if(!jd || jd.isDeleted){
            return res.status(404).json({status:"N",message:"Job Description not found"});
        }
        await AIJD.update(
            { isDeleted: true },
            { where: { id: id } }
        );
        return res.status(200).json({status:"Y",message:"Job Description Deleted Successfully!"});
    }catch(error){
        return res.status(500).json({status:"N", error:`Internal Error: ${error}`});

    }
};
