const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  paidBy: {
    type: String,
  },
  mgoodId: {
    type: String,
  },
});

module.exports = mongoose.model("payment", PaymentSchema);
