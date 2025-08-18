const mongoose = require("mongoose");

const rewardScehma = new mongoose.Schema(
  {
    phone: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardScehma);
