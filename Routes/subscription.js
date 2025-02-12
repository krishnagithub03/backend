// Routes/subscription.js
const express = require('express');
const router = express.Router();
const Subscription = require('./subscription');

// Create new subscription
router.post('/create', async (req, res) => {
  try {
    const { userId, paymentId } = req.body;
    
    const subscription = new Subscription({
      userId,
      paymentId
    });

    await subscription.save();
    res.status(201).json({ 
      success: true, 
      subscription 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get subscription status
router.get('/status/:userId', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      userId: req.params.userId,
      active: true,
      expiryDate: { $gt: new Date() }
    });
    
    res.status(200).json({ 
      success: true, 
      subscription 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Use a consultation
router.post('/use-consultation', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await Subscription.findById(subscriptionId);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (!subscription.active || subscription.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Subscription expired'
      });
    }

    if (subscription.remainingConsultations <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No consultations remaining'
      });
    }

    subscription.remainingConsultations -= 1;
    await subscription.save();

    res.status(200).json({
      success: true,
      remainingConsultations: subscription.remainingConsultations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;