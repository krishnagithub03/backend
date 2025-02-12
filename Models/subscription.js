// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  totalConsultations: {
    type: Number,
    default: 8
  },
  remainingConsultations: {
    type: Number,
    default: 8
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: () => new Date(+new Date() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
  },
  active: {
    type: Boolean,
    default: true
  },
  paymentId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);