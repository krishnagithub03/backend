const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/logout", authController.logoutHandler);

module.exports = router;
