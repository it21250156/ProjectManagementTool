const express = require('express');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
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

// Function to generate random values based on normal distribution
const generateRandomValue = (mean, std, min, max) => {
  let value;
  do {
      value = Math.round(mean + std * (Math.random() * 2 - 1)); // Generate a value within range
  } while (value < min || value > max);
  return value;
};


// ✅ Create a new project
router.post('/', async (req, res) => {
  const { projectName, projectDescription, start_date, members } = req.body;

  try {
      // Validate input
      if (!projectName || !start_date || !Array.isArray(members) || members.length === 0) {
          return res.status(400).json({ message: 'Invalid project data' });
      }

      // ✅ Ensure members are valid ObjectIds
      const formattedMembers = members.map(member => new mongoose.Types.ObjectId(member));

      // ✅ Validate that the members exist in the User collection
      const existingUsers = await User.find({ _id: { $in: formattedMembers } }).select('_id');
      if (existingUsers.length !== formattedMembers.length) {
          return res.status(400).json({ message: 'One or more member IDs are invalid' });
      }

      // ✅ Generate automatic values
      const newProject = new Project({
          projectName,
          projectDescription,
          start_date,
          members: formattedMembers, // Directly store ObjectIds

          // Auto-generated fields
          team_size: generateRandomValue(9.2, 1.9235, 7, 12),
          task_count: generateRandomValue(92, 26.5989, 60, 130),
          developer_experience: generateRandomValue(3.6, 1.1402, 2, 5),
          priority_level: generateRandomValue(2.2, 0.8367, 1, 3),
          task_complexity: generateRandomValue(1.64, 0.2702, 1.3, 2),
          effort_hours: generateRandomValue(4680, 931.1283, 3500, 6000),
          project_size: generateRandomValue(68400, 14926.4865, 50000, 90000),
          testing_coverage: Math.min(0.8, Math.max(0.74, (0.766 + 0.02408 * (Math.random() * 2 - 1)).toFixed(3))),
          Effort_Density: Math.min(0.2, Math.max(0.16, (0.18 + 0.0158 * (Math.random() * 2 - 1)).toFixed(3))),
          Team_Productivity: generateRandomValue(25.18, 5.2045, 18.9, 32.4),
          LoC_per_Team_Member: generateRandomValue(3460, 296.6479, 3000, 3800),
          defect_fix_time_minutes: generateRandomValue(486, 45.0555, 430, 550),
          size_added: generateRandomValue(1140, 230.2173, 900, 1500),
          size_deleted: generateRandomValue(280, 49.4975, 220, 350),
          size_modified: generateRandomValue(750, 111.8034, 600, 900),
          requirement_changes: generateRandomValue(4.4, 2.0736, 2, 7),
          change_impact_factor: Math.min(1.2, Math.max(1.0, (1.12 + 0.0837 * (Math.random() * 2 - 1)).toFixed(3))),
          team_key: generateRandomValue(3, 1.5811, 1, 5) // Categorical value encoded
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

// ✅ Get leaderboard for a specific project (Points earned only from this project)
// ✅ Get project leaderboard
router.get('/:projectId/leaderboard', async (req, res) => {
  try {
    const { projectId } = req.params;

    // ✅ Ensure project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // ✅ Find completed tasks for this project
    const completedTasks = await Task.find({ project: projectId, status: 'Completed' }).populate('assignedTo', 'name');

    if (!completedTasks.length) {
      return res.status(200).json([]);
    }

    // ✅ Calculate points earned per user in this project
    const leaderboard = completedTasks.reduce((acc, task) => {
      const userId = task.assignedTo?._id.toString();
      if (!userId) return acc;

      if (!acc[userId]) {
        acc[userId] = { name: task.assignedTo.name, points: 0 };
      }

      // Assign points based on task priority
      let taskPoints = 0;
      switch (task.priority.toLowerCase()) {
        case 'high': taskPoints = 10; break;
        case 'medium': taskPoints = 5; break;
        case 'low': taskPoints = 3; break;
        default: taskPoints = 0;
      }

      acc[userId].points += taskPoints;
      return acc;
    }, {});

    // ✅ Convert leaderboard object into an array & sort by points
    const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => b.points - a.points);

    res.status(200).json(sortedLeaderboard);
  } catch (error) {
    console.error('Error fetching project leaderboard:', error);
    res.status(500).json({ message: 'Error fetching project leaderboard' });
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
