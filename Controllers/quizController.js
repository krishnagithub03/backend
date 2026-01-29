const rules = require("../rules");
const categoryMessages = require("../categoryMessages");
const calculateLevel = require("../utils/levelCalculator");

exports.evaluateQuiz = (req, res) => {
  const { answers } = req.body;
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Invalid answers payload" });
  }

  const triggeredCategories = new Set();

  for (const rule of rules) {
    const userAnswer = answers[rule.id];
    if (!userAnswer) continue;

    const categories = rule.triggers[userAnswer];
    if (categories) {
      categories.forEach(cat => triggeredCategories.add(cat));
    }
  }

  const categoryArray = [...triggeredCategories];

  const result = categoryArray.map(cat => ({
    category: cat,
    message: categoryMessages[cat]
  }));

  const level = calculateLevel(categoryArray);
  res.json({
    categories: categoryArray,
    level,
    result
  });
};
