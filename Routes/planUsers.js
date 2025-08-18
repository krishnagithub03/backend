const express = require("express");
const router = express.Router();

const {
  registerPlanUser,
  teleconsultPlanUser,
  activatePlan
} = require("../Controllers/planUserController.js");

// Register a Plan User
router.post("/register", registerPlanUser);

// Handle teleconsultation
router.post("/teleconsult", teleconsultPlanUser);

router.patch("/activate-plan/:userId", activatePlan);

module.exports = router;
