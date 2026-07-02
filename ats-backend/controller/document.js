const Document = require("../models/Document.Model");

//////////////////////////////////////////////////////////////////////////////////
exports.uploadDocument = async (req, res)=>{
    try{
        const{ candidateId, userId, type, fileName, filePath, fileSize, mimeType } = req.body;
        if(!candidateId || !userId || !type || !fileName || !filePath || !fileSize || !mimeType){
            return res.status(400).json({status:"N", error:"All required fields are required"});
        }
        const newDocument = await Document.create({
            candidateId,
            userId,
            type,
            fileName,
            filePath,
            fileSize,
            mimeType,
            uploadedBy: req.user ? req.user.userId : null
        });
        return res.status(201).json({status:"Y", message:"Document uploaded successfully", data: newDocument});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};
///////////////////////////////////////////////////////////////////////////////////
exports.getDocuments = async(req, res)=>{
    try{
        // For candidate users, only show their own documents
        // For admin/recruiter users, show all documents
        let documents;
        if (req.user.role === 'admin' || req.user.role === 'recruiter') {
            documents = await Document.findAll({
                where: { isDeleted: false }
            });
        } else {
            documents = await Document.findAll({
                where: { userId: req.user.userId, isDeleted: false }
            });
        }
        if(!documents || documents.length === 0){
            return res.status(404).json({status:"N", message:"No Documents found"});
        }
        return res.status(200).json({status:"Y", message:"Documents retrieved successfully", data: documents});
    }catch(error){
        return res.status(500).json({status:"N",error:"Internal error!"});
    }

};

exports.getDocumentById = async (req, res) => {
    let id = req.params.id;
    try{
        const document = await Document.findByPk(id);
        if(!document || document.isDeleted){
            return res.status(404).json({status:"N",message:"Document not found"});
        }
        // Check if user has permission to access this document
        if (req.user.role !== 'admin' && req.user.role !== 'recruiter' && document.userId.toString() !== req.user.userId) {
            return res.status(403).json({status:"N",message:"Access denied"});
        }
        return res.status(200).json({status:"Y",message:"Document retrieved successfully", data: document});
    }catch(error){
        return res.status(500).json({status:"N", error:`Internal Error: ${error}`});

    }
};

exports.deleteDocument = async (req, res) => {
    let id = req.params.id;
    try{
        // Check if user has permission to delete this document
        const document = await Document.findByPk(id);
        if(!document || document.isDeleted){
            return res.status(404).json({status:"N",message:"Document not found"});
        }
        if (req.user.role !== 'admin' && req.user.role !== 'recruiter' && document.userId.toString() !== req.user.userId) {
            return res.status(403).json({status:"N",message:"Access denied"});
        }
        await Document.update(
            { isDeleted: true },
            { where: { id: id } }
        );
        return res.status(200).json({status:"Y",message:"Document Deleted Successfully!"});
    }catch(error){
        return res.status(500).json({status:"N", error:`Internal Error: ${error}`});

    }
};
