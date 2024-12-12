const express = require("express");
const router = express.Router();

const {
  razorpayOrder,
  razorpayVerify,
  reachPaymentTest,
} = require("../Controllers/transactionController.js");

router.post("/order", razorpayOrder);
router.post("/verify", razorpayVerify);
router.get("/", reachPaymentTest);

module.exports = router;
