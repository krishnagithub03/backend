const EventResult = require("../Models/EventResult");

const createEventResult = async (req, res) => {
  try {
    const {
      eventName,
      eventDescription,
      eventDate,
      firstPositionName,
      firstPositionPhotoUrl,
      firstPositionVideoUrl,
      secondPositionName,
      secondPositionPhotoUrl,
      secondPositionVideoUrl,
      thirdPositionName,
      thirdPositionPhotoUrl,
      thirdPositionVideoUrl,
    } = req.body;

    // Validate required fields
    if (
      !eventName ||
      !eventDate ||
      !firstPositionName ||
      !secondPositionName ||
      !thirdPositionName
    ) {
      return res.status(400).json({
        message:
          "eventName, eventDate, firstPositionName, secondPositionName, and thirdPositionName are required",
      });
    }

    const eventResult = new EventResult({
      eventName,
      eventDescription,
      eventDate,
      firstPositionName,
      firstPositionPhotoUrl,
      firstPositionVideoUrl,
      secondPositionName,
      secondPositionPhotoUrl,
      secondPositionVideoUrl,
      thirdPositionName,
      thirdPositionPhotoUrl,
      thirdPositionVideoUrl,
    });

    await eventResult.save();

    return res.status(201).json({
      message: "Event result created successfully",
      data: eventResult,
    });
  } catch (error) {
    console.error("Error creating event result:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllEventResults = async (req, res) => {
  try {
    const eventResults = await EventResult.find().sort({ eventDate: -1 });

    return res.status(200).json({
      message: "Event results fetched successfully",
      data: eventResults,
    });
  } catch (error) {
    console.error("Error fetching event results:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createEventResult,
  getAllEventResults,
};
