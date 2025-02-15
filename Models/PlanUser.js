const mongoose = require("mongoose");

const PlanUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  price: { type: Number, required: true },
  userId: { type: String, unique: true, required: true }, // Unique User ID
  numberOfTc: { type: Number, default: 8 }, // Default 8 teleconsultations
  createdAt: { type: Date, default: Date.now }, // Will be stored in IST
  isBoarded: { type: Boolean, default: false }, // Default false
});

module.exports = mongoose.model("PlanUser", PlanUserSchema);
