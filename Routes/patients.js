const express = require("express");
const router = express.Router();

const {
    getAllPatients,
    getCountPatients
} = require("../Controllers/patientController");

router.get('/patientCnt', getCountPatients);

module.exports = router;
