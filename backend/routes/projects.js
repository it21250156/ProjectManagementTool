const express = require('express');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const { verifyToken } = require('../middleware/auth');
const dayjs = require('dayjs');
const router = express.Router();
const mongoose = require('mongoose');

const {
  getMembersForProject
} = require("../controllers/projectController");


// ✅ Calculate XP-based badges
const calculateBadges = (earnedXP) => {
  const badges = [];

  if (earnedXP >= 30) badges.push('Task Beginner');
  if (earnedXP >= 100) badges.push('Task Master');
  if (earnedXP >= 200) badges.push('XP Achiever');
  if (earnedXP >= 500) badges.push('Legendary Worker');

  return badges;
};

// ✅ Update user level based on XP
const updateLevel = (earnedXP) => {
  let xpThreshold = 50;
  let level = 1;

  while (earnedXP >= xpThreshold) {
    level++;
    xpThreshold *= 2;
  }

  return level;
};

// ✅ Calculate Base XP from Task Priority
const getBaseXP = (task) => {
  switch (task.priority) {
    case 'high': return 10;
    case 'medium': return 5;
    case 'low': return 3;
    default: return 5;
  }
};

// ✅ Calculate Bonus XP from Skills
const getBonusXP = (user, task, baseXP, userTasks) => {
  let bonusXP = 0;
  const now = dayjs();
  const completedTasksToday = userTasks.filter(t => dayjs(t.completedAt).isSame(now, 'day')).length;

  // 🎯 Time-based XP Boosts
  if (user.unlockedSkills.some(skill => skill.name === "Early Bird") && now.hour() < 12) {
    bonusXP += 3;
  }
  if (user.unlockedSkills.some(skill => skill.name === "Night Owl") && now.hour() >= 20) {
    bonusXP += 3;
  }

  // 🎯 Task-based XP Boosts
  if (user.unlockedSkills.some(skill => skill.name === "Fast Finisher")) {
    bonusXP += 2;
  }
  if (user.unlockedSkills.some(skill => skill.name === "Deadline Master") && dayjs(task.deadline).isAfter(now)) {
    bonusXP += baseXP; // Double XP
  }
  if (user.unlockedSkills.some(skill => skill.name === "Task Streaker") && completedTasksToday >= 3) {
    bonusXP += 5;
  }
  if (user.unlockedSkills.some(skill => skill.name === "Multitasker") && completedTasksToday >= 2) {
    bonusXP += 4;
  }

  return bonusXP;
};

/**
 * 📌 Routes
 */


// ✅ Create a new project
router.post('/', async (req, res) => {
  const { projectName, projectDescription, startDate, members } = req.body;

  try {
    // Validate input
    if (!projectName || !startDate || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'Invalid project data' });
    }

    // ✅ Ensure members are valid ObjectIds
    const formattedMembers = members.map(member => new mongoose.Types.ObjectId(member));

    // ✅ Validate that the members exist in the User collection
    const existingUsers = await User.find({ _id: { $in: formattedMembers } }).select('_id');
    if (existingUsers.length !== formattedMembers.length) {
      return res.status(400).json({ message: 'One or more member IDs are invalid' });
    }

    // Create the new project
    const newProject = new Project({
      projectName,
      projectDescription,
      startDate,
      members: formattedMembers, // Directly store ObjectIds
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully!', project: newProject });

  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ message: 'Server error while creating project' });
  }
});


// ✅ Get earned XP, completed tasks, badges, and level for the logged-in user
router.get('/user-total-xp', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('unlockedSkills');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const badges = calculateBadges(user.earnedXP);
    const level = updateLevel(user.earnedXP);

    res.status(200).json({
      earnedXP: user.earnedXP,
      completedTasks: user.completedTasks,
      badges,
      level,
      unlockedSkills: user.unlockedSkills.map(skill => skill.name),
    });
  } catch (error) {
    console.error('Error calculating user XP:', error.message);
    res.status(500).json({ message: 'Error calculating user XP' });
  }
});

// ✅ Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('members.memberId', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// ✅ Get projects for the logged-in user
router.get('/user-projects', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ 'members.memberId': userId }).populate('members.memberId', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching user projects' });
  }
});

// ✅ Get details for a specific project, including leaderboard
router.get('/:projectId', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('members.memberId', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const leaderboard = project.members.map((member) => ({
      memberId: member.memberId._id,
      name: member.memberId.name,
      points: member.tasks.filter((task) => task.completed).reduce((sum, task) => sum + task.points, 0),
    }));

    res.status(200).json({ project, leaderboard });
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Error fetching project details' });
  }
});

// ✅ Mark a task as completed & apply bonus XP from skills
router.put('/:projectId/complete-task', verifyToken, async (req, res) => {
  const { memberId, taskId } = req.body;

  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const member = project.members.find((m) => m.memberId.toString() === memberId);
    if (!member) return res.status(404).json({ message: 'Member not found in this project' });

    const task = member.tasks.find((t) => t._id.toString() === taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.completed) {
      return res.status(400).json({ message: 'Task is already completed' });
    }

    task.completed = true;
    task.completedAt = new Date();

    // ✅ Update user stats
    const user = await User.findById(memberId).populate('unlockedSkills');
    const userTasks = member.tasks.filter(t => t.completed);

    // 🎯 Bonus XP Calculation
    const baseXP = getBaseXP(task);
    const bonusXP = getBonusXP(user, task, baseXP, userTasks);
    const totalXP = baseXP + bonusXP;

    user.points += baseXP;
    user.completedTasks += 1;
    user.earnedXP += totalXP;
    user.badges = calculateBadges(user.earnedXP);
    user.level = updateLevel(user.earnedXP);

    await user.save();
    await project.save();

    res.status(200).json({
      message: `Task completed! Total XP Earned: ${totalXP} (${baseXP} + Bonus: ${bonusXP})`,
      userStats: {
        earnedXP: user.earnedXP,
        completedTasks: user.completedTasks,
        badges: user.badges,
        level: user.level,
        bonusXP,
        unlockedSkills: user.unlockedSkills.map(skill => skill.name),
      }
    });

  } catch (error) {
    console.error('Error marking task as completed:', error);
    res.status(500).json({ message: 'Error marking task as completed' });
  }
});

router.get("/:projectId/members", getMembersForProject);

module.exports = router;
