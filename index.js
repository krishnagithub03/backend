const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const doctorRoutes = require("./Routes/doctors.js");
const paymentRoutes = require("./Routes/payment.js");
const subscriptionRoutes = require("./Routes/subscription.js");
const adminRoutes = require("./Routes/admin.js");
const prescriptionRoutes = require("./Routes/prescription.js");
const { Server } = require("socket.io");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// Import Subscription model
const Subscription = require('./models/Subscription');

// Middleware setup
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Keep track of active appointments and subscriptions
const activeAppointments = new Map();
const activeSubscriptions = new Map();

// Routes
app.use("/api", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/subscription", subscriptionRoutes);

// Third-party appointment creation
app.post("/third-party/create-appointment", async (req, res) => {
  try {
    // First check if user has active subscription with remaining consultations
    const userId = req.body.userId; // Make sure this is passed in the request
    const subscription = await Subscription.findOne({
      userId,
      active: true,
      remainingConsultations: { $gt: 0 },
      expiryDate: { $gt: new Date() }
    });

    if (!subscription) {
      return res.status(403).json({ 
        success: false,
        message: "No active subscription or consultations remaining" 
      });
    }

    const response = await axios.post(
      "https://cusipco.in/api/B2B/create-appointment",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "API-Secret-Key": process.env.NEXT_PUBLIC_CUSIPCO_API_SECRET_KEY,
          "API-Secret-Token": process.env.NEXT_PUBLIC_CUSIPCO_API_SECRET_TOKEN,
          "API-Environment": process.env.NEXT_PUBLIC_CUSIPCO_ENVIRONMENT,
          "Accept-Language": "en",
        },
      }
    );

    // If appointment creation successful, decrement consultation count
    subscription.remainingConsultations -= 1;
    if (subscription.remainingConsultations === 0) {
      subscription.active = false;
    }
    await subscription.save();

    return res.status(200).json({
      ...response.data,
      remainingConsultations: subscription.remainingConsultations
    });
  } catch (error) {
    console.error("Error in proxy:", error.message);
    res.status(500).json({ message: "Failed to create appointment" });
  }
});

// Webhook configuration
const apiCredentials = {
  apiId: process.env.NEXT_PUBLIC_WEBHOOK_API_ID,
  apiSecret: process.env.NEXT_PUBLIC_WEBHOOK_API_SECRET,
};

// Webhook endpoint
app.post("/webhook/tc-update", (req, res) => {
  const receivedApiId = req.headers["mgood-api-id"];
  const receivedApiSecret = req.headers["mgood-api-secret"];

  if (!receivedApiId || !receivedApiSecret) {
    return res.status(401).send({ message: "Missing API ID or Secret" });
  }

  if (
    receivedApiId !== apiCredentials.apiId ||
    receivedApiSecret !== apiCredentials.apiSecret
  ) {
    return res.status(403).send({ message: "Invalid API credentials" });
  }

  const { triggered_action, name, custom_order_id } = req.body;
  console.log("Webhook Received:", req.body);
  
  io.emit("update", { triggered_action, name, custom_order_id });
  res.status(200).send({ message: "Webhook processed successfully" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    console.error("Stack:", err.stack);
  });

// Socket.IO Server Setup
const io = new Server({
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://mgood.org",
      "https://www.mgood.org",
      "https://admin.mgood.org",
    ],
    methods: ["GET", "POST"],
  },
});

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle appointment booking
  socket.on("appointment-booked", async (data) => {
    console.log("New Appointment Booked:", data);
    
    try {
      // Check subscription in database instead of memory
      const subscription = await Subscription.findOne({
        userId: data.userId,
        active: true,
        remainingConsultations: { $gt: 0 },
        expiryDate: { $gt: new Date() }
      });

      if (!subscription) {
        socket.emit("appointment-error", {
          message: "No active subscription or consultations remaining",
          appointmentId: data.id
        });
        return;
      }

      // Store the appointment
      activeAppointments.set(data.id, {
        ...data,
        status: "pending",
        createdAt: Date.now()
      });

      // Notify admins
      io.emit("notify-admin", { data });

      // Emit subscription status
      socket.emit("subscription-updated", {
        remainingConsultations: subscription.remainingConsultations
      });
    } catch (error) {
      console.error("Error processing appointment:", error);
      socket.emit("appointment-error", {
        message: "Failed to process appointment",
        appointmentId: data.id
      });
    }
  });

  // Handle subscription events
  socket.on("subscription-created", async (data) => {
    console.log("New Subscription Created:", data);
    
    try {
      const subscription = await Subscription.findById(data.subscriptionId);
      if (subscription) {
        activeSubscriptions.set(data.userId, {
          remainingConsultations: subscription.remainingConsultations,
          createdAt: subscription.createdAt,
          expiryDate: subscription.expiryDate
        });
        
        io.emit("subscription-update", {
          type: "created",
          data: subscription
        });
      }
    } catch (error) {
      console.error("Error handling subscription creation:", error);
    }
  });

  // Check subscription status
  socket.on("check-subscription", async (userId) => {
    try {
      const subscription = await Subscription.findOne({
        userId,
        active: true,
        expiryDate: { $gt: new Date() }
      });

      socket.emit("subscription-status", {
        active: subscription ? true : false,
        remainingConsultations: subscription ? subscription.remainingConsultations : 0,
        expiryDate: subscription ? subscription.expiryDate : null
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      socket.emit("subscription-status", {
        active: false,
        error: "Failed to check subscription status"
      });
    }
  });

  // Handle appointment status updates
  socket.on("update-appointment-status", async ({ appointmentId, status, userId }) => {
    console.log(`Attempting to update appointment ${appointmentId} to ${status} by ${userId}`);
    
    const appointment = activeAppointments.get(appointmentId);
    
    if (!appointment) {
      socket.emit("appointment-error", {
        message: "Appointment not found",
        appointmentId
      });
      return;
    }

    if (appointment.status !== "pending") {
      socket.emit("appointment-error", {
        message: "Appointment is no longer available",
        appointmentId
      });
      return;
    }

    // Update appointment status
    appointment.status = status;
    appointment.acceptedBy = userId;
    activeAppointments.set(appointmentId, appointment);

    // Notify all connected clients
    io.emit("appointment-status-updated", {
      appointmentId,
      status,
      userId
    });
  });

  // Cleanup interval
  const cleanupInterval = setInterval(async () => {
    const now = Date.now();
    
    // Clean appointments
    for (const [id, appointment] of activeAppointments.entries()) {
      if (now - appointment.createdAt > 30000) { // 30 seconds
        activeAppointments.delete(id);
        io.emit("appointment-expired", { appointmentId: id });
      }
    }
    
    // Clean expired subscriptions from memory
    for (const [userId, subscription] of activeSubscriptions.entries()) {
      if (now > subscription.expiryDate) {
        activeSubscriptions.delete(userId);
        io.emit("subscription-expired", { userId });
      }
    }
  }, 1000);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clearInterval(cleanupInterval);
  });
});

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

io.attach(server);