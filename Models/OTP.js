const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires after 5 minutes
  },
  attempts: {
    type: Number,
    default: 0,
  },
  lastAttemptAt: {
    type: Date,
  },
});

module.exports = mongoose.model("OTP", otpSchema);
