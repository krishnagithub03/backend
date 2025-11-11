const express = require("express");
const router = express.Router();
const googleSheetsController = require("../Controllers/googleSheetsController");

router.post("/submit-individual-request", googleSheetsController.submitIndividualRequest);
router.post("/submit-corporate-request", googleSheetsController.submitCorporateRequest);

module.exports = router;
