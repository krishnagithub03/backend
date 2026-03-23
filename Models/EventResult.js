const mongoose = require("mongoose");

const eventResultSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      default: "",
    },
    eventDate: {
      type: Date,
      required: true,
    },
    firstPositionName: {
      type: String,
      required: true,
    },
    firstPositionPhotoUrl: {
      type: String,
      default: "",
    },
    firstPositionVideoUrl: {
      type: String,
      default: "",
    },
    secondPositionName: {
      type: String,
      required: true,
    },
    secondPositionPhotoUrl: {
      type: String,
      default: "",
    },
    secondPositionVideoUrl: {
      type: String,
      default: "",
    },
    thirdPositionName: {
      type: String,
      required: true,
    },
    thirdPositionPhotoUrl: {
      type: String,
      default: "",
    },
    thirdPositionVideoUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventResult", eventResultSchema);
