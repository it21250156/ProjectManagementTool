const express = require('express');
const User = require('../models/userModel');
const { verifyToken } = require('../middleware/auth'); // Ensure user authentication
const router = express.Router();
const mongoose = require('mongoose');

/**
 * Get All Users (For Assigning Members to Projects)
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
 * Get User Profile (Including Unlocked Skills)
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('unlockedSkills'); // Ensure population

    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log("🌟 Sending User Profile:", user); // Debugging Backend Response

    res.status(200).json({
      name: user.name,
      email: user.email,
      points: user.points,
      completedTasks: user.completedTasks,
      earnedXP: user.earnedXP,
      badges: user.badges,
      unlockedSkills: user.unlockedSkills || [], // Ensure it returns an array
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Fetch user profile
router.get('/profile-info', verifyToken, async (req, res) => {
  try {
    console.log('Fetching user profile for user ID:', req.user.id); // Debugging
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      console.error('User not found for ID:', req.user.id); // Debugging
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User data:', user); // Debugging
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get Top 25 Users by XP (Global Leaderboard)
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ earnedXP: -1 }) // Sort by highest XP
      .limit(25) // Only get the top 25 users
      .select('name earnedXP'); // Only return name & XP

    res.status(200).json(topUsers);
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Import verifyToken middleware
router.get('/performance-evaluation', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, {
      name: 1,
      level: 1,
      completedTasks: 1,
      earnedXP: 1,
      avgEffortHours: 1,
      onTimeDeliveryRate: 1,
      currentTaskLoad: 1,
      email: 1
    });

    res.status(200).json(users);
  } catch (err) {
    console.error('Performance evaluation fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch user performance data.' });
  }
});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = router;