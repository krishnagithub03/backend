const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../Middlewares/auth");
const { createAgent } = require("../Controllers/agentController");

// POST /agents - Create a new insurance agent (Admin only)
router.post("/", verifyToken, authorizeRoles("admin"), createAgent);

module.exports = router;
