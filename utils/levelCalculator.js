module.exports = function calculateLevel(categories) {
    const count = categories.length;
    if (categories.includes("A") && categories.includes("E")) {
      return "HIGH";
    }
    if (count >= 4) {
      return "HIGH";
    }
    if (count >= 2) {
      return "MEDIUM";
    }
    return "LOW";
  };
  