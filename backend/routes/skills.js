const express = require('express');
const Skill = require('../models/skillModel');
const User = require('../models/userModel');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * 
 * Get all available skills
 */
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().populate('dependencies', 'name');
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Error fetching skills' });
  }
});

/**
 * Add a new skill
 */
router.post('/add', async (req, res) => {
  try {
    const { name, description, branch, tier, pointsRequired, dependencies } = req.body;

    const newSkill = new Skill({ name, description, branch, tier, pointsRequired, dependencies: dependencies || [] });
    await newSkill.save();
    res.status(201).json({ message: `Skill "${name}" added successfully!`, skill: newSkill });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ message: 'Error adding skill' });
  }
});

/**
 * Unlock a skill
 */
router.post('/unlock', verifyToken, async (req, res) => {
  try {
    const { skillId } = req.body;
    const user = await User.findById(req.user.id).populate('unlockedSkills');

    if (user.unlockedSkills.some(skill => skill._id.toString() === skillId)) {
      return res.status(400).json({ message: 'Skill already unlocked' });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (user.points < skill.pointsRequired) {
      return res.status(400).json({ message: 'Not enough points to unlock this skill' });
    }

    user.points -= skill.pointsRequired; // ✅ Points decrease, but XP remains
    user.unlockedSkills.push(skill);
    await user.save();

    res.json({ message: `Skill "${skill.name}" unlocked successfully!`, unlockedSkills: user.unlockedSkills });
  } catch (error) {
    console.error('Error unlocking skill:', error);
    res.status(500).json({ message: 'Error unlocking skill' });
  }
});

module.exports = router;
