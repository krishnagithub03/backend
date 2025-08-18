const express = require("express");
const router = express.Router();

const {
    uploadExcel,
} = require("../Controllers/RegisterUserController.js");

router.post("/excel", uploadExcel);


module.exports = router;
