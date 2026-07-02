const Candidate = require("../models/Candidate.Model");

//////////////////////////////////////////////////////////////////////////////////
exports.createCandidate = async (req, res)=>{
    try{
        const{ name, email, skills, status} = req.body;
        if(!name || !email|| !skills || !status){
            return res.status(401).json({status:"N", error:"All fields are required"});
        }
        const newCandidate = await Candidate.create({
            name,
            email,
            skills,
            status,
        });
        return res.status(201).json({status:"Y", message:"Candidate created successfully", data: newCandidate})
    }catch(error){
        return res.status(501).json({status:"N",error:"Internal error!"});
    }

};
///////////////////////////////////////////////////////////////////////////////////
exports.getCandidates = async(req, res)=>{
    try{
        const candidates = await Candidate.findAll({
            where: { isDeleted: false }
        });
        if(!candidates || candidates.length === 0){
            return res.status(404).json({status:"N", message:"No candidate found"});
        }
        return res.status(201).json({status:"Y", message:"Candidates Retrieved successfully", data: candidates})
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

////////////////////////////////////////////////////////////////////////////////////////
exports.deleteCandidate = async (req, res) => {
    let id = req.params.id;
    try{
        const candidate = await Candidate.findByPk(id);
        if(!candidate || candidate.isDeleted){
            return res.status(404).json({status:"N",message:"Candidate not found"});
        }
        await Candidate.update(
            { isDeleted: true },
            { where: { id: id } }
        );
        return res.status(201).json({status:"Y",message:"Candidate Deleted Successfully!"});
    }catch(error){
        return res.status(500).json({status:"N", error:"Internal Error!"});

    }
};