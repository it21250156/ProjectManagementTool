const express = require('express');
const router = express.Router();

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  // Mock data — in a real app, fetch from database or ML model
  const userProfile = {
    name: "Rovinya Wijerama",
    experience: "Intermediate",
    completedTasks: 12,
    earnedXP: 750,
    level: 5,
    delayProbability: "Medium",
    delayMessage: "Rovinya has been focusing on predictive analytics delay predictions, and model integrations, notably in a delay prediction Flask app and Machine Learning assignments."
  };

  res.json(userProfile);
});

module.exports = router;
