const express = require("express");
const doctorModel = require("../Models/Doctor.js");

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

module.exports = {
  getAllDoctors,
  getDoctorsByLocation,
  getDoctorsBySpecialization,
  addDoctor,
  updateDoctor,
  getDoctorById,
};
