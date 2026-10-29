const express = require("express");
const router = express.Router();

const {
  issueDiwaliCoupon,
  verifyCoupon,
  redeemCoupon,
  getAllClaims,
} = require("../Controllers/diwaliController");

// Primary endpoint for claiming/issuing a Diwali coupon
// Also aliases /claim and /issue for developer convenience
router.post("/", issueDiwaliCoupon);
router.post("/claim", issueDiwaliCoupon);
router.post("/issue", issueDiwaliCoupon);

// Verify/lookup coupon
router.get("/verify/:couponCode", verifyCoupon);
router.post("/verify", verifyCoupon);

// Redeem coupon
router.post("/redeem", redeemCoupon);

// List/search claims (admin dashboard & reporting)
router.get("/claims", getAllClaims);

module.exports = router;
