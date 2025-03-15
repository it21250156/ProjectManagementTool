const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get leaderboard
router.get('/', async (req, res) => {
    try {
        const leaderboard = await User.find().sort({ points: -1 }).limit(10);
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add points to a user
router.post('/add-points', async (req, res) => {
    const { name, points } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { name },
            { $inc: { points } },
            { new: true, upsert: true } // Create if not exists
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
