const express = require("express");
const mongoose = require("mongoose");
const doctorModel = require("../Models/Doctor.js");
const appointmentModel = require("../Models/Appointments.js");
const patientModel = require("../Models/Patient.js");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getDoctorById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const doctor = await doctorModel.findById(id);
    res.status(200).json(doctor);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getDoctorsByLocation = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ place: req.params.place });
    res.status(200).json(doctors);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getDoctorsBySpecialization = async (req, res) => {
  console.log(req.params.specialization);
  try {
    const doctors = await doctorModel.find({
      specialization: req.params.specialization,
    });
    res.status(200).json(doctors);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const addDoctor = async (req, res) => {
  const doctor = req.body;
  const newDoctor = new doctorModel(doctor);
  try {
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const saveAppointment = async (req, res) => {
  const { data } = req.body;
  const newAppointment = new appointmentModel(data);
  try {
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const savePatientDetails = async (req, res) => {
  const { data } = req.body;

  try {
    const newPatient = new patientModel(data);
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const doctor = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No doctor with that id");
  const updatedDoctor = await doctorModel.findByIdAndUpdate(id, doctor, {
    new: true,
  });
  res.json(updatedDoctor);
};

const getDoctorByValue = async (req, res) => {
  const { email } = req.body;
  const docExists = await doctorModel.findOne({ email });
  if (docExists) {
    res.status(200).json({ exists: true });
  } else {
    res.status(403).json({ exists: false });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorsByLocation,
  getDoctorsBySpecialization,
  addDoctor,
  updateDoctor,
  getDoctorById,
  saveAppointment,
  savePatientDetails,
  getDoctorByValue,
};
