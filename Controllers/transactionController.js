const express = require("express");
const mongoose = require("mongoose");
const paymentModel = require("../Models/Payment.js");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const razorpayOrder = async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: "mgood_receipt_teleconsultation",
  };
  try {
    const order = await instance.orders.create(options);
    res.status(200).json({ data: order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const razorpayVerify = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  console.log(req.body);

  //   const instance = new Razorpay({
  //     key_id: process.env.RAZORPAY_KEY_ID,
  //     key_secret: process.env.RAZORPAY_KEY_SECRET,
  //   });

  try {
    // Create Sign
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Create ExpectedSign
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    console.log(razorpay_signature === expectedSign);

    // Create isAuthentic
    const isAuthentic = expectedSign === razorpay_signature;

    // Condition
    if (isAuthentic) {
      const payment = new paymentModel({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Save Payment
      await payment.save();

      // Send Message
      res.json({
        message: "Payement Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

module.exports = {
  razorpayOrder,
  razorpayVerify,
};
