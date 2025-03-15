const express = require('express');
const User = require('../models/userModel');
const { verifyToken } = require('../middleware/auth'); // Ensure user authentication
const router = express.Router();

/**
 * ✅ Get All Users (For Assigning Members to Projects)
 * This is needed in Create Project Page.
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email'); // Fetch only name & email
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

/**
 * ✅ Get User Profile (Including Unlocked Skills)
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('unlockedSkills');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      name: user.name,
      email: user.email,
      points: user.points,
      completedTasks: user.completedTasks,
      earnedXP: user.earnedXP,
      badges: user.badges,
      unlockedSkills: user.unlockedSkills,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

module.exports = router;
