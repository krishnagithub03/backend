const mongoose = require("mongoose");

const diwaliUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      index: true,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    serviceInterest: {
      type: String,
      trim: true,
      default: null,
    },
    couponCode: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    faceValue: {
      type: Number,
      default: 500,
    },
    currency: {
      type: String,
      default: "INR",
    },
    campaignId: {
      type: String,
      default: "MGOOD_DIWALI_2026",
    },
    status: {
      type: String,
      enum: ["Issued", "Redeemed", "Expired", "Cancelled"],
      default: "Issued",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date("2026-12-31T23:59:59.999Z"),
    },
    redeemedAt: {
      type: Date,
      default: null,
    },
    redemptionReference: {
      type: String,
      default: null,
    },
    redeemedBy: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    privacyAccepted: {
      type: Boolean,
      default: true,
    },
    marketingOptIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound sparse index on email to avoid collision on nulls
diwaliUserSchema.index({ email: 1 }, { sparse: true });

module.exports = mongoose.model("DiwaliUser", diwaliUserSchema);
