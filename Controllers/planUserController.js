const PlanUser = require("../Models/PlanUser");
const crypto = require("crypto");

// Function to generate UID with 8-digit unique number
const generateUserId = () => {
  return `UID${crypto.randomInt(10000000, 99999999)}`;
};

// Register Plan User
const registerPlanUser = async (req, res) => {
  try {
    const { name, email, phone, price } = req.body;

    // Check if user already exists
    let existingUser = await PlanUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const userId = generateUserId(); // Generate unique User ID

    // Convert UTC to IST (IST = UTC + 5:30)
    const createdAtIST = new Date();
    createdAtIST.setHours(createdAtIST.getHours() + 5);
    createdAtIST.setMinutes(createdAtIST.getMinutes() + 30);

    const newUser = new PlanUser({
      name,
      email,
      phone,
      price,
      userId,
      numberOfTc: 8,
      createdAt: createdAtIST, // Store createdAt in IST time
      isBoarded: false, // Default value
    });

    await newUser.save();

    res.status(201).json({
      userId,
      message: "User registered successfully with 8 teleconsultations.",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Handle Teleconsultation
const teleconsultPlanUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const planUser = await PlanUser.findOne({ userId });

    if (!planUser) {
      return res.status(404).json({ error: "User ID not found." });
    }

    if (planUser.numberOfTc > 0) {
      planUser.numberOfTc -= 1;
      await planUser.save();
      return res.json({
        message: "Teleconsultation successful!",
        remainingTeleconsultations: planUser.numberOfTc,
      });
    } else {
      return res.status(400).json({ error: "No remaining teleconsultations." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const activatePlan = async (req, res) => {
  try {
    const { userId } = req.params; 

    const planUser = await PlanUser.findOne({ userId }); 

    if (!planUser) {
      return res.status(404).json({ error: "User not found." });
    }

    planUser.isBoarded = true; // Update isBoarded field
    await planUser.save();

    return res.json({ message: "Plan activated successfully!" });
  } catch (error) {
    console.error("Error activating plan:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


module.exports = { registerPlanUser, teleconsultPlanUser, activatePlan };
