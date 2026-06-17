const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../Middlewares/auth");
const {
  createAgent,
  getAllAgents,
  getAgentBySlug,
} = require("../Controllers/agentController");

router.get("/", getAllAgents);
router.get("/:slug", getAgentBySlug);
router.post("/", verifyToken, authorizeRoles("admin"), createAgent);

module.exports = router;
