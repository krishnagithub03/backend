const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const doctorRoutes = require("./Routes/doctors.js");
const paymentRoutes = require("./Routes/payment.js");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRoutes = require("./Routes/admin.js");
const { Server } = require("socket.io");
const axios = require("axios");
const prescriptionRoutes = require("./Routes/prescription.js");

// Middleware setup
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Keep track of active appointments
const activeAppointments = new Map();

// Routes
app.use("/api", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);
app.use("/prescription", prescriptionRoutes);

// Third-party appointment creation
app.post("/third-party/create-appointment", async (req, res) => {
  try {
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
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in proxy:", error.message);
    res.status(500).json({ message: "Failed to fetch data from third-party API." });
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

  // Handle new appointment bookings
  socket.on("appointment-booked", (data) => {
    console.log("New Appointment Booked:", data);
    
    // Store the appointment with initial status
    activeAppointments.set(data.id, {
      ...data,
      status: "pending",
      createdAt: Date.now()
    });

    // Notify all admins about the new appointment
    io.emit("notify-admin", { data });
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

    // Notify all connected clients about the status update
    io.emit("appointment-status-updated", {
      appointmentId,
      status,
      userId
    });
  });

  // Clean up expired appointments
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [id, appointment] of activeAppointments.entries()) {
      if (now - appointment.createdAt > 30000) { // 30 seconds
        activeAppointments.delete(id);
        io.emit("appointment-expired", { appointmentId: id });
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