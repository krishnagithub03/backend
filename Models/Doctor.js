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
    enum: [
      "Dental",
      "Ortho",
      "Derma",
      "Patho",
      "Pedo",
      "Physiotherapy",
      "General Physician",
      "Dietician",
      "Gyane",
      "Psychiatry",
      "Cardio",
      "Neuro",
      "Urology",
      "Pulmonologist",
      "General Surgeon",
      "Radiology",
      "Hair Transplant Clinics",
      "Plastic Surgeon",
      "Ayurveda",
      "Homeopathy",
      "Eye",
      "ENT",
      "Primary Healthcare Centres",
      "Yoga Instructors",
      "Pharmacy",
      "Diagnostic Centres",
      "PRO",
    ],
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
  AccessRole: {
    type: String,
    required: true,
    enum: ["Doctor", "Partner"],
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
