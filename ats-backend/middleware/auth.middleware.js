const jwt = require("jsonwebtoken");

// Authentication middleware
function authenticateJWT(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Access denied, token missing" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ error: "Invalid Token" });
    }
}

// Role-based authorization middleware
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }
        
        const userRole = req.user.role;
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                error: "Access denied", 
                message: `User role '${userRole}' is not authorized for this action` 
            });
        }
        
        next();
    };
}

// Self-access only middleware (for profile access)
function authorizeSelf() {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }
        
        // For profile access, user can only access their own data
        const userIdFromToken = req.user.userId;
        const userIdFromParams = req.params.id || req.params.userId;
        
        if (userIdFromParams && userIdFromParams !== userIdFromToken) {
            return res.status(403).json({ 
                error: "Access denied", 
                message: "You can only access your own profile" 
            });
        }
        
        next();
    };
}

module.exports = {
    authenticateJWT,
    authorizeRoles,
    authorizeSelf
};