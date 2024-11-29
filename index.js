const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const doctorRoutes = require("./Routes/doctors.js");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// const adminRoutes = require("./Routes/admin.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://mgood.vercel.app",
    origin: "https://mgood.org",
    origin: "https://www.mgood.org",
    credentials: true,
  })
);

//Routing
app.use("/api", doctorRoutes);
// app.use("/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
