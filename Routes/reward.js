const express = require("express");

const Router = express.Router();
const {
  getRewardPoints,
  addRewardPoints,
  redeemRewardPoints,
} = require("../Controllers/rewardController");

Router.post("/get-reward-points", getRewardPoints);
Router.post("/add-reward-points", addRewardPoints);
Router.post("/redeem-reward-points", redeemRewardPoints);

module.exports = Router;
