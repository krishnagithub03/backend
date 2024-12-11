const express = require("express");
const router = express.Router();

const {
  razorpayOrder,
  razorpayVerify,
} = require("../Controllers/transactionController.js");

router.post("/order", razorpayOrder);
router.post("/verify", razorpayVerify);

module.exports = router;
