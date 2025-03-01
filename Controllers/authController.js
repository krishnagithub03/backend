const OTP = require("../Models/OTP");
const { sendSMS } = require("../services/smsService");
const User = require("../Models/Users");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check retry attempts
    const existingOTP = await OTP.findOne({ phoneNumber });
    if (existingOTP) {
      const timeSinceLastAttempt = Date.now() - existingOTP.lastAttemptAt;
      if (existingOTP.attempts >= 3 && timeSinceLastAttempt < 60000) {
        return res.status(429).json({
          message: "Too many attempts. Please try again after 60 seconds.",
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();

    // Store OTP in database
    await OTP.findOneAndUpdate(
      { phoneNumber },
      {
        phoneNumber,
        otp,
        attempts: existingOTP ? existingOTP.attempts + 1 : 0,
        lastAttemptAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    // Send SMS using external API
    try {
      await sendSMS(phoneNumber, otp);
    } catch (smsError) {
      // If SMS fails, delete the OTP record and throw error
      await OTP.deleteOne({ phoneNumber });
      throw new Error("Failed to send SMS OTP");
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

const jwt = require("jsonwebtoken");

exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const otpRecord = await OTP.findOne({ phoneNumber, otp }).sort({
      createdAt: -1,
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check OTP expiry (5 minutes)
    if (Date.now() - otpRecord.createdAt > 5 * 60 * 1000) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // Generate JWT Token
    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Store user identity and token in the database
    await User.findOneAndUpdate(
      { phoneNumber },
      { name : "Mgood User"},
      { phoneNumber, accessToken: token },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "OTP verified", token, phoneNumber });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};


exports.logoutHandler = (req, res) => {
  try {
    // Clear authentication token and user identity from cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // Ensure secure flag matches how it was set
      sameSite: "strict",
    });

    res.clearCookie("user", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

