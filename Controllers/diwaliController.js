const crypto = require("crypto");
const DiwaliUser = require("../Models/DiwaliUser");

/**
 * Generate a cryptographically secure, human-friendly unique coupon code.
 * Format: MGDW-XXXX-XXXX (e.g. MGDW-7F9K-2P4E)
 * Uses unambiguous characters (excluding 0, O, 1, I).
 */
const generateCouponCode = () => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) randomPart += "-";
    const index = crypto.randomInt(0, charset.length);
    randomPart += charset[index];
  }
  return `MGDW-${randomPart}`;
};

/**
 * Normalizes phone numbers (removes whitespace and special characters).
 */
const normalizePhone = (phone) => {
  if (!phone) return "";
  return String(phone).trim().replace(/[\s-]/g, "");
};

/**
 * Issue or retrieve a Diwali Gift Card Coupon.
 * - Checks whether a coupon is already issued for the provided phone OR email.
 * - If found, returns the already issued coupon code with message "already issued".
 * - If not found, generates a unique secure coupon code, saves it to the database, and returns it.
 */
const issueDiwaliCoupon = async (req, res) => {
  try {
    const {
      fullName,
      name,
      phone,
      phoneNumber,
      mobile,
      email,
      city,
      serviceInterest,
      marketingOptIn,
      privacyAccepted,
    } = req.body;

    // Support flexible naming conventions for name and phone
    const applicantName = (fullName || name || "").trim();
    const rawPhone = phone || phoneNumber || mobile;
    const cleanPhone = normalizePhone(rawPhone);
    const cleanEmail = email && typeof email === "string" ? email.trim().toLowerCase() : null;

    // Basic Validation
    if (!applicantName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!cleanPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    // Build condition to check if phone OR email already exists
    const searchConditions = [{ phone: cleanPhone }];

    // If 10-digit number or with country code, also check variations
    if (cleanPhone.length >= 10) {
      const last10Digits = cleanPhone.slice(-10);
      searchConditions.push({ phone: last10Digits });
      searchConditions.push({ phone: `+91${last10Digits}` });
      searchConditions.push({ phone: `91${last10Digits}` });
    }

    if (cleanEmail) {
      searchConditions.push({ email: cleanEmail });
    }

    // Check for existing claim
    const existingClaim = await DiwaliUser.findOne({
      $or: searchConditions,
    });

    if (existingClaim) {
      return res.status(200).json({
        success: true,
        alreadyIssued: true,
        message: "already issued",
        couponCode: existingClaim.couponCode,
        data: {
          id: existingClaim._id,
          fullName: existingClaim.fullName,
          phone: existingClaim.phone,
          email: existingClaim.email,
          couponCode: existingClaim.couponCode,
          faceValue: existingClaim.faceValue,
          currency: existingClaim.currency,
          status: existingClaim.status,
          expiresAt: existingClaim.expiresAt,
          offer: "Complimentary face scan + ₹500 gift card for eligible MGood services",
          issuedAt: existingClaim.issuedAt,
        },
      });
    }

    // Generate unique coupon code with collision prevention
    let couponCode = "";
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      couponCode = generateCouponCode();
      const codeExists = await DiwaliUser.findOne({ couponCode });
      if (!codeExists) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate a unique coupon code. Please try again.",
      });
    }

    // Create and save new Diwali claim
    const newClaim = new DiwaliUser({
      fullName: applicantName,
      phone: cleanPhone,
      email: cleanEmail,
      city: city ? String(city).trim() : null,
      serviceInterest: serviceInterest ? String(serviceInterest).trim() : null,
      couponCode,
      faceValue: 500,
      currency: "INR",
      campaignId: "MGOOD_DIWALI_2026",
      status: "Issued",
      expiresAt: new Date("2026-12-31T23:59:59.999Z"),
      privacyAccepted: privacyAccepted !== undefined ? Boolean(privacyAccepted) : true,
      marketingOptIn: Boolean(marketingOptIn),
    });

    await newClaim.save();

    return res.status(201).json({
      success: true,
      alreadyIssued: false,
      message: "Coupon code generated successfully",
      couponCode: newClaim.couponCode,
      data: {
        id: newClaim._id,
        fullName: newClaim.fullName,
        phone: newClaim.phone,
        email: newClaim.email,
        city: newClaim.city,
        serviceInterest: newClaim.serviceInterest,
        couponCode: newClaim.couponCode,
        faceValue: newClaim.faceValue,
        currency: newClaim.currency,
        status: newClaim.status,
        expiresAt: newClaim.expiresAt,
        offer: "Complimentary face scan + ₹500 gift card for eligible MGood services",
        issuedAt: newClaim.issuedAt,
      },
    });
  } catch (error) {
    // Handle duplicate key error (race condition on unique couponCode or index)
    if (error.code === 11000) {
      try {
        const { phone, phoneNumber, mobile, email } = req.body;
        const cleanPhone = normalizePhone(phone || phoneNumber || mobile);
        const cleanEmail = email && typeof email === "string" ? email.trim().toLowerCase() : null;

        const orConditions = [{ phone: cleanPhone }];
        if (cleanEmail) orConditions.push({ email: cleanEmail });

        const existing = await DiwaliUser.findOne({ $or: orConditions });
        if (existing) {
          return res.status(200).json({
            success: true,
            alreadyIssued: true,
            message: "already issued",
            couponCode: existing.couponCode,
            data: existing,
          });
        }
      } catch (findErr) {
        console.error("Error retrieving existing claim on collision:", findErr);
      }
    }

    console.error("Error issuing Diwali coupon:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while processing the request.",
      error: error.message,
    });
  }
};

/**
 * Verify / Lookup Coupon details.
 */
const verifyCoupon = async (req, res) => {
  try {
    const rawCode = req.params.couponCode || req.body.couponCode;

    if (!rawCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    const couponCode = String(rawCode).trim().toUpperCase();
    const coupon = await DiwaliUser.findOne({ couponCode });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    const isExpired = new Date() > new Date(coupon.expiresAt);
    if (isExpired && coupon.status === "Issued") {
      coupon.status = "Expired";
      await coupon.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        couponCode: coupon.couponCode,
        fullName: coupon.fullName,
        phone: coupon.phone,
        status: coupon.status,
        faceValue: coupon.faceValue,
        currency: coupon.currency,
        expiresAt: coupon.expiresAt,
        isExpired: new Date() > new Date(coupon.expiresAt),
        redeemedAt: coupon.redeemedAt,
      },
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * Redeem Coupon (atomic operation to prevent double redemption).
 */
const redeemCoupon = async (req, res) => {
  try {
    const { couponCode, redemptionReference, redeemedBy } = req.body;

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    const code = String(couponCode).trim().toUpperCase();

    // Check if coupon exists
    const coupon = await DiwaliUser.findOne({ couponCode: code });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon code not found.",
      });
    }

    // Check expiry
    if (new Date() > new Date(coupon.expiresAt)) {
      if (coupon.status !== "Expired") {
        coupon.status = "Expired";
        await coupon.save();
      }
      return res.status(400).json({
        success: false,
        message: "Coupon code has expired.",
      });
    }

    // Atomically find and update status from "Issued" to "Redeemed"
    const updatedCoupon = await DiwaliUser.findOneAndUpdate(
      { couponCode: code, status: "Issued" },
      {
        $set: {
          status: "Redeemed",
          redeemedAt: new Date(),
          redemptionReference: redemptionReference || null,
          redeemedBy: redeemedBy || "staff",
        },
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(400).json({
        success: false,
        message: `Coupon cannot be redeemed. Current status is '${coupon.status}'.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon redeemed successfully.",
      data: updatedCoupon,
    });
  } catch (error) {
    console.error("Error redeeming coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * List / Search all claims (Admin / Reporting endpoint).
 */
const getAllClaims = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { couponCode: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [claims, total] = await Promise.all([
      DiwaliUser.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      DiwaliUser.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      claims,
    });
  } catch (error) {
    console.error("Error fetching claims:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  issueDiwaliCoupon,
  verifyCoupon,
  redeemCoupon,
  getAllClaims,
};
