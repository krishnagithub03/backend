const InsuranceAgent = require("../Models/InsuranceAgent");


const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-"); // collapse multiple hyphens
};


const getUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let counter = 1;

  while (await InsuranceAgent.findOne({ slug })) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

/**
 * @desc    Create a new insurance agent
 * @route   POST /agents
 * @access  Private (Admin only)
 */
const createAgent = async (req, res) => {
  try {
    const {
      agentId,
      fullName,
      profileImageUrl,
      bio,
      verificationBadges,
      experience,
      specializations,
      performanceStats,
      professionalDetails,
      serviceFees,
      media,
    } = req.body;

    // Check if agent with the same agentId already exists
    const existingAgent = await InsuranceAgent.findOne({ agentId });

    if (existingAgent) {
      return res.status(409).json({
        success: false,
        message: "An agent with this agentId already exists.",
      });
    }

    // Auto-generate a unique slug from the fullName
    const slug = await getUniqueSlug(generateSlug(fullName));

    const newAgent = new InsuranceAgent({
      agentId,
      fullName,
      slug,
      profileImageUrl,
      bio,
      verificationBadges,
      experience,
      specializations,
      performanceStats,
      professionalDetails,
      serviceFees,
      media,
    });

    const savedAgent = await newAgent.save();

    res.status(201).json({
      success: true,
      message: "Agent created successfully.",
      data: savedAgent,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: messages,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `Duplicate value for field: ${duplicateKey}.`,
      });
    }

    console.error("Error creating agent:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating agent.",
    });
  }
};

module.exports = { createAgent };
