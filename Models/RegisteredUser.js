const mongoose = require("mongoose");

function generateMUID() {
    return `MUID:${Math.floor(10000 + Math.random() * 90000)}`;
}

const registeredUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: generateMUID,
      unique: true,
    },
    phoneNumber: { type: String, unique: true, sparse: true },
    accessToken: { type: String },
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    role: { type: String, default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// At least one of phoneNumber or email must be present
registeredUserSchema.pre("validate", function (next) {
  if (!this.phoneNumber && !this.email) {
    this.invalidate("phoneNumber", "Either phoneNumber or email is required.");
    this.invalidate("email", "Either phoneNumber or email is required.");
  }
  next();
});

module.exports = mongoose.model("RegisteredUser", registeredUserSchema);
