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
      "Cardiology",
      "Dermatology",
      "Endocrinology",
      "Gastroenterology",
      "General Surgery",
      "Nephrology",
      "Neurology",
      "Obstetrics",
      "Ophthalmology",
      "Orthopedics",
      "Pediatrics",
      "Psychiatry",
      "Pulmonology",
      "Radiology",
      "Rheumatology",
      "Urology",
      "Anesthesia",
      "Pathology",
      "Oncology",
      "Infectious Diseases",
      "Plastic Surgery",
      "Emergency Medicine",
      "Otolaryngology",
      "Geriatrics",
      "Sports Medicine",
      "Family Medicine",
      "Internal Medicine",
    ], // List of specialization options
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
