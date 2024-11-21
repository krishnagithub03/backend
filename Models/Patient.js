const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },
  pastMedicalHistory: {
    type: String,
    // required: false,
  },
  currentMedication: {
    type: String,
    // required: false,
  },
});

module.exports = mongoose.model("Patient", patientSchema);
