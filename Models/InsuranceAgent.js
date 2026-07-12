const mongoose = require("mongoose");
const crypto = require("crypto");

// --- Enum definitions ---
const INSURANCE_TYPES = [
  "Health",
  "Life",
  "Motor",
  "SME",
  "Travel",
  "Home",
  "Term",
  "Critical Illness",
  "Personal Accident",
  "Fire",
  "Marine",
  "Liability",
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Gujarati",
  "Bengali",
  "Punjabi",
  "Odia",
  "Urdu",
];

// --- Sub-schemas ---
const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true },
  },
  { _id: false }
);

const careerTimelineSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    eventDescription: { type: String, required: true },
  },
  { _id: false }
);

const socialLinksSchema = new mongoose.Schema(
  {
    whatsapp: { type: String, default: null },
    phone: { type: String, default: null },
    facebook: { type: String, default: null },
    twitter: { type: String, default: null },
    instagram: { type: String, default: null },
    linkedin: { type: String, default: null },
  },
  { _id: false }
);

// --- Main Schema ---
const insuranceAgentSchema = new mongoose.Schema(
  {
    agentId: {
      type: String,
      unique: true,
      required: [true, "Agent ID is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Slug is required"],
      lowercase: true,
      trim: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
      trim: true,
    },
    pincode: {
      type: String,
      default: null,
      trim: true,
    },

    // Verification badges
    verificationBadges: {
      isIrdaiLicensed: { type: Boolean, default: false },
      isTrusted: { type: Boolean, default: false },
      licenseNumber: { type: String, default: null },
    },

    // Experience
    experience: {
      yearsOfExperience: { type: Number, default: 0 },
      totalClientsServed: { type: Number, default: 0 },
      languages: {
        type: [{ type: String, enum: LANGUAGES }],
        default: ["English"],
      },
    },

    // Specializations
    specializations: {
      insuranceTypes: {
        type: [{ type: String, enum: INSURANCE_TYPES }],
        required: [true, "At least one insurance type is required"],
        validate: {
          validator: (v) => v.length > 0,
          message: "At least one insurance type must be specified.",
        },
      },
    },

    // Performance stats
    performanceStats: {
      claimsProcessedCount: { type: Number, default: 0 },
      successRatePercentage: { type: Number, default: 0, min: 0, max: 100 },
      totalClaimsSettledValue: { type: String, default: "0" },
      averageResponseTime: { type: String, default: null },
      averageRating: { type: Number, default: 0.0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
    },

    // Professional details
    professionalDetails: {
      certifications: { type: [certificationSchema], default: [] },
      achievementsSummary: { type: String, default: null },
      careerTimeline: { type: [careerTimelineSchema], default: [] },
    },

    // Service fees
    serviceFees: {
      newPolicyFee: { type: String, default: "Free" },
      policyReviewFee: { type: String, default: "Free" },
      consultationFee: { type: String, default: null },
    },

    // Media
    media: {
      achievementImages: { type: [String], default: [] },
      socialLinks: { type: socialLinksSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

// Pre-validate hook to generate agentId
insuranceAgentSchema.pre("validate", async function (next) {
  if (!this.agentId) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      const randomDigits = crypto.randomInt(10000000, 99999999);
      const generatedId = `MgoodAgent${randomDigits}`;
      
      // Query the database to check if this agentId already exists
      const existing = await this.constructor.findOne({ agentId: generatedId });
      if (!existing) {
        this.agentId = generatedId;
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return next(new Error("Failed to generate a unique agent ID after multiple attempts."));
    }
  }
  next();
});

// Index for fast lookups
insuranceAgentSchema.index({ slug: 1 });
insuranceAgentSchema.index({ agentId: 1 });

module.exports = mongoose.model("InsuranceAgent", insuranceAgentSchema);
