const express = require("express");
const router = express.Router();

const {
  razorpayOrder,
  razorpayVerify,
  reachPaymentTest,
  updateDetails,
  saveQrPaymentDetials
} = require("../Controllers/transactionController.js");

router.post("/order", razorpayOrder);
router.post("/verify", razorpayVerify);
router.post("/qr", saveQrPaymentDetials);
router.get("/", reachPaymentTest);
router.patch("/:razorpay_payment_id", updateDetails);


module.exports = router;
