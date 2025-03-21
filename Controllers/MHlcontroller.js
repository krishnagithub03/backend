const MHlmodel= require("../Models/MHL.js");



const getMatch = async (req, res) => {
    try {
      // Find the most recent match by sorting in descending order based on _id
      // MongoDB ObjectIds contain a timestamp component, so sorting by _id works for recency
      const match = await MHlmodel.findOne()
        .sort({ _id: -1 });  // Sort by _id, newest first
      
      if (!match) {
        return res.status(404).json({ message: 'No match found' });
      }
      
      // Return only the match data
      res.json(match);
    } catch (error) {
      console.error('Error fetching match:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  const postMatch = async (req, res) => {
    try {
      // Extract the match name from the request body
      const { matchName } = req.body;
      
      // Validate input
      if (!matchName) {
        return res.status(400).json({ message: 'Match name is required' });
      }
      
      // Create a new match using the MHLmodel
      const newMatch = new MHlmodel({
        matchName: matchName
      });
      
      // Save the new match to the database
      const savedMatch = await newMatch.save();
      
      // Return the created match with a 201 (Created) status code
      res.status(201).json({
        message: 'Match created successfully',
        match: savedMatch
      });
    } catch (error) {
      console.error('Error creating match:', error);
      
      // Check for validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          error: error.message 
        });
      }
      
      // Handle other errors
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  };
  


  module.exports={getMatch,postMatch};



