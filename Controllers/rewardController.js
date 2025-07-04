const Reward = require("../Models/Reward");

const getRewardPoints = async (req, res) => {
  try {
    // Simulate fetching reward points from a database
    const phone = req.body.phone;
    // Validate input
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    // Find the reward points for the given phone number
    const rewardPoints = await Reward.findOne({ phone: phone });
    if (!rewardPoints) {
      return res
        .status(404)
        .json({ message: "Reward points not found for this phone number" });
    }
    return res.status(200).json({ points: rewardPoints.points });
  } catch (error) {
    console.error("Error fetching reward points:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addRewardPoints = async (req, res) => {
  try {
    const { phone, points } = req.body;

    // Validate input
    if (!phone || !points) {
      return res
        .status(400)
        .json({ message: "Phone number and points are required" });
    }

    // Check if the reward entry exists
    let rewardEntry = await Reward.findOne({ phone: phone });

    if (rewardEntry) {
      // Update existing entry
      rewardEntry.points += points;
      await rewardEntry.save();
    } else {
      // Create new entry
      rewardEntry = new Reward({ phone, points });
      await rewardEntry.save();
    }

    return res
      .status(200)
      .json({
        message: "Reward points updated successfully",
        points: rewardEntry.points,
      });
  } catch (error) {
    console.error("Error adding reward points:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const redeemRewardPoints = async (req, res) => {
  const { phone, points } = req.body;
  try {
    // Validate input
    if (!phone || !points) {
      return res
        .status(400)
        .json({ message: "Phone number and points are required" });
    }

    // Find the reward entry
    const rewardEntry = await Reward.findOne({ phone: phone });

    if (!rewardEntry) {
      return res
        .status(404)
        .json({ message: "Reward entry not found for this phone number" });
    }

    // Check if there are enough points to redeem
    if (rewardEntry.points < points) {
      return res.status(400).json({ message: "Insufficient reward points" });
    }

    // Deduct points
    rewardEntry.points -= points;
    await rewardEntry.save();

    return res
      .status(200)
      .json({
        message: "Reward points redeemed successfully",
        remainingPoints: rewardEntry.points,
      });
  } catch (error) {
    console.error("Error redeeming reward points:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRewardPoints,
  addRewardPoints,
  redeemRewardPoints,
};
