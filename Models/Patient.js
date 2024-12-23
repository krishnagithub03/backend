// const mongoose = require("mongoose");

// const patientSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: Number,
//     required: true,
//   },
//   gender: {
//     type: String,
//     required: true,
//   },
//   specialization: {
//     type: String,
//     required: true,
//   },
//   place: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: Number,
//     required: true,
//     unique: true,
//   },

// });

// module.exports = mongoose.model("Patient", patientSchema);

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
    enum: ["M", "F", "Other"], // Limited to M, F, or Other
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
      "Associate",
      "RMP",
    ],
    // List of specialization options
  },
  place: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  mgoodId: {
    type: String,
    required: true,
    enum: ["ID001", "ID002", "ID003", "ID004"], // Example IDs, replace with real options
  },
});

module.exports = mongoose.model("Patient", patientSchema);
