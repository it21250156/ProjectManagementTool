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

// router.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const user = new User({ name, email, password });
//     await user.save();
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Error creating user' });
//   }
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Here you can generate a token or set up a session
//     res.status(200).json({ message: 'Login successful', user });
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Error logging in' });
//   }
// });

module.exports = router;
