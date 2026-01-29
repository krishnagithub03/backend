const express = require("express");
const router = express.Router();
const { evaluateQuiz } = require("../Controllers/quizController");

router.post("/result", evaluateQuiz);


module.exports = router;
