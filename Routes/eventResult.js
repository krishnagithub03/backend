const express = require("express");

const Router = express.Router();
const {
  createEventResult,
  getAllEventResults,
} = require("../Controllers/eventResultController");

Router.post("/create", createEventResult);
Router.get("/all", getAllEventResults);

module.exports = Router;
