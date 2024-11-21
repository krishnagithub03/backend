const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const doctorRoutes = require("./Routes/doctors.js");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://mgood.vercel.app",
    credentials: true,
  })
);

//Routing
app.use("/api", doctorRoutes);

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
