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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [
      // "http://localhost:3000",
      // "http://localhost:3001",
      "https://mgood.vercel.app",
      "https://mgood.org",
      "https://www.mgood.org",
    ],
    credentials: true,
  })
);

//Routing
app.use("/api", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);

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
      // "http://localhost:3000"
      // , "http://localhost:3001"
      "https://mgood.vercel.app",
      "https://mgood.org",
      "https://www.mgood.org",
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
