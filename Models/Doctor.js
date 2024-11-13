const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  exp: {
    type: Number,
    required: true,
  },
  establishmentType: {
    type: String,
    required: true,
  },
  clinicName: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  clinicNumber: {
    type: String,
    required: true,
  },
  clinicService: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  sessionTimings: {
    type: String,
    required: true,
  },
  uploadFile: {
    type: String,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
