const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");
const { authenticateJWT } = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

// Sign-up Route
router.post("/signup", validationMiddleware.signup, async (req, res) => {
    try {
        const userData = req.body;
        const user = await userService.register(userData);
        
        return res.status(201).json({ 
            status: "Y", 
            message: "User Registered Successfully", 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(400).json({ 
            status: "N", 
            message: error.message 
        });
    }
});

// Login Route
router.post("/login", validationMiddleware.login, async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        
        return res.status(200).json({ 
            status: "Y", 
            message: "Login Successfully", 
            token: result.token, 
            user: { 
                id: result.user.id, 
                name: result.user.name, 
                email: result.user.email,
                role: result.user.role
            } 
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(401).json({ 
            status: "N", 
            message: error.message 
        });
    }
});

// Get current user profile
router.get("/profile", authenticateJWT, async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({ 
                status: "N", 
                message: "User not found" 
            });
        }
        
        const userObj = user.dataValues || user;
        const { password, deleted_at, ...userWithoutPassword } = userObj;
        return res.status(200).json({ 
            status: "Y", 
            message: "Profile retrieved successfully", 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error("Profile error:", error);
        return res.status(500).json({ 
            status: "N", 
            message: "Internal Server Error" 
        });
    }
});

module.exports = router;