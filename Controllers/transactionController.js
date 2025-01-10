const express = require("express");
const mongoose = require("mongoose");
const paymentModel = require("../Models/Payment.js");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const razorpayOrder = async (req, res) => {
  console.log(req.body);
  console.log(process.env.RAZORPAY_KEY_ID);
  console.log(process.env.RAZORPAY_KEY_SECRET);
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  if (!req.body.amount || typeof req.body.amount !== "number") {
    return res.status(400).json({ message: "Invalid amount in request" });
  }
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "mgood_receipt_teleconsultation",
    };
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
    // Trim and ensure consistent encoding for input values
    const trimmedOrderId = razorpay_order_id.trim();
    const trimmedPaymentId = razorpay_payment_id.trim();
    const trimmedSignature = razorpay_signature.trim();

    // Create Sign
    const sign = `${trimmedOrderId}|${trimmedPaymentId}`;

    // Create ExpectedSign
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    console.log("Order ID:", trimmedOrderId);
    console.log("Payment ID:", trimmedPaymentId);
    console.log("Signature:", trimmedSignature);
    console.log("Expected Sign:", expectedSign);
    console.log("Signature Match:", expectedSign === trimmedSignature);

    // Create isAuthentic
    const isAuthentic = expectedSign === trimmedSignature;

    // Condition
    if (isAuthentic) {
      const payment = new paymentModel({
        razorpay_order_id: trimmedOrderId,
        razorpay_payment_id: trimmedPaymentId,
        razorpay_signature: trimmedSignature,
      });

      // Save Payment
      await payment.save();

      // Send Message
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.error("Error during payment verification:", error);
  }
};
const reachPaymentTest = async (req, res) => {
  try {
    res.json({
      message: "Payement route is reached",
    });
  } catch (error) {
    res.status(500).json({ message: "unable to get to payments route" });
    console.log(error);
  }
};

const updateDetails = async (req, res) => {
  const { razorpay_payment_id } = req.params;

  if (!razorpay_payment_id) {
    return res.status(400).send("ID is required.");
  }

  try {
    const { name, mgoodId } = req.body;
    // Fixing the issue by combining the update fields into a single object
    const updatePay = await paymentModel.findOneAndUpdate(
      { razorpay_payment_id },
      { paidBy: name, mgoodId: mgoodId }, // Combined fields into one object
      { new: true } // Return the updated document
    );

    if (!updatePay) {
      return res.status(404).send("No Record");
    }
    res.status(200).json(updatePay);
  } catch (error) {
    console.error("Error updating Payment:", error);
    res.status(500).send("An error occurred while updating the Payment.");
  }
};

module.exports = {
  razorpayOrder,
  razorpayVerify,
  reachPaymentTest,
  updateDetails,
};
