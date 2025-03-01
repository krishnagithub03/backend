const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    accessToken: { type: String },
    name: { type: String }, // Optional: User's name
    email: { type: String, unique: true, sparse: true }, // Optional: User's email
    role : { type: String, default: "user" }, // Optional: User's role
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
