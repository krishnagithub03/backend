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

// app.use(
//   cors({
//     origin: [
//       // "http://localhost:3000",
//       // "http://localhost:3001",
//       "https://mgood.org",
//       "https://www.mgood.org",
//       "https://admin.mgood.org",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Routing
app.use("/api", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);
app.use("/prescription", prescriptionRoutes);

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
    res
      .status(500)
      .json({ message: "Failed to fetch data from third-party API." });
  }
});

const apiCredentials = {
  apiId: process.env.NEXT_PUBLIC_WEBHOOK_API_ID,
  apiSecret: process.env.NEXT_PUBLIC_WEBHOOK_API_SECRET,
};

// Webhook endpoint
// app.post("https://api.mgood.org/webhook/tc-update", (req, res) => {
app.post("/webhook/tc-update", (req, res) => {
  const receivedApiId = req.headers["mgood-api-id"];
  const receivedApiSecret = req.headers["mgood-api-secret"];

  // Check for missing credentials
  if (!receivedApiId || !receivedApiSecret) {
    return res.status(401).send({ message: "Missing API ID or Secret" });
  }

  // Validate credentials
  if (
    receivedApiId !== apiCredentials.apiId ||
    receivedApiSecret !== apiCredentials.apiSecret
  ) {
    return res.status(403).send({ message: "Invalid API credentials" });
  }

  // Extract and log payload
  const { triggered_action, name, custom_order_id } = req.body;
  console.log("Webhook Received:", req.body);

  // Emit the triggered action to connected clients
  io.emit("update", { triggered_action, name, custom_order_id });

  // Respond to the sender
  res.status(200).send({ message: "Webhook processed successfully" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

const io = new Server({
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      // "https://mgood.vercel.app",
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

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("appointment-booked", (data) => {
    console.log("Appointment Booked:", data);

    // Notify all connected clients
    io.emit("notify-admin", data);
  });
});

const server = app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

io.attach(server);
