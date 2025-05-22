const mongoose = require('mongoose');
const Task = require('../models/taskModel');
const User = require('../models/userModel'); // ✅ Import User model once
const dayjs = require('dayjs'); // ✅ Import dayjs at the top

// ✅ Get all Tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get a single Task
const getTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Task ID' });
    }

    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Create a Task with complexity and effortEstimate
const createTask = async (req, res) => {
    const { taskName, dueDate, assignedTo, project, priority, complexity, effortEstimate } = req.body;

    try {
        // Fetch the user to access their experienceLevel
        const user = await User.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ error: 'Assigned user not found' });
        }

        // Predict estimated task duration using COCOMO-inspired logic
        const estimateTaskDuration = (complexity, effort, experience) => {
            const complexityFactor = { Low: 1.0, Medium: 1.2, High: 1.5 };
            const experienceFactor = { Junior: 1.2, Mid: 1.0, Senior: 0.8 };

            const base = effort * complexityFactor[complexity];
            return base * experienceFactor[experience];
        };

        const estimatedDuration = estimateTaskDuration(complexity, effortEstimate, user.experienceLevel);

        // Create the task
        const task = await Task.create({
            taskName,
            dueDate,
            assignedTo,
            project,
            priority,
            complexity,
            effortEstimate,
            estimatedDuration
        });

        res.status(201).json({ 
            task,
            estimatedDuration: `${estimatedDuration.toFixed(2)} hours` 
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// ✅ Update a Task
const updateTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Task ID' });
    }

    try {
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete a Task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Task ID' });
    }

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get Tasks by Project
const getTasksByProject = async (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: 'Invalid Project ID' });
    }

    try {
        const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await Task.findById(id).populate('assignedTo', 'name');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        let baseXP = 0;
        let bonusXP = 0;
        let totalXP = 0;
        let levelUp = false;
        let newBadges = [];
        let updatedLevel = null;
        let activatedSkills = []; // ✅ Store activated skills

        if (status === "Completed") {
            const user = await User.findById(task.assignedTo).populate('unlockedSkills');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // ✅ Determine Base XP from Priority
            switch (task.priority.toLowerCase()) {
                case 'high': baseXP = 10; break;
                case 'medium': baseXP = 5; break;
                case 'low': baseXP = 3; break;
            }

            const now = dayjs();

            // ✅ Apply Skill Effects
            if (user.unlockedSkills.some(skill => skill.name === "Early Bird") && now.hour() < 12) {
                bonusXP += 3;
                activatedSkills.push("Early Bird");
            }
            if (user.unlockedSkills.some(skill => skill.name === "Night Owl") && now.hour() >= 20) {
                bonusXP += 3;
                activatedSkills.push("Night Owl");
            }
            if (user.unlockedSkills.some(skill => skill.name === "Fast Finisher")) {
                bonusXP += 2;
                activatedSkills.push("Fast Finisher");
            }
            if (user.unlockedSkills.some(skill => skill.name === "Deadline Master") && now.isBefore(dayjs(task.dueDate))) {
                bonusXP += baseXP;
                activatedSkills.push("Deadline Master");
            }

            totalXP = baseXP + bonusXP;
            const prevLevel = user.level;

            // ✅ Update User XP & Level
            user.earnedXP += totalXP;
            user.points += baseXP;
            user.completedTasks += 1;

            user.level = Math.floor(Math.log2(user.earnedXP / 50) + 1);
            updatedLevel = user.level;

            if (user.level > prevLevel) {
                levelUp = true;
            }

            // 🔁 Update experienceLevel based on updated level
            if (user.level <= 3) {
                user.experienceLevel = 'Junior';
            } else if (user.level <= 6) {
                user.experienceLevel = 'Mid';
            } else {
                user.experienceLevel = 'Senior';
            }

            // ✅ Check for new badges
            const badgeMilestones = {
                30: "Task Beginner",
                100: "Task Master",
                200: "XP Achiever",
                500: "Legendary Worker"
            };

            Object.entries(badgeMilestones).forEach(([xp, badge]) => {
                if (user.earnedXP >= xp && !user.badges.includes(badge)) {
                    user.badges.push(badge);
                    newBadges.push(badge);
                }
            });

            await user.save();
        }

        // ✅ Update Task Status
        task.status = status;
        await task.save();

        res.status(200).json({
            message: `Task completed! Total XP: ${totalXP} (Base: ${baseXP}, Bonus: ${bonusXP})`,
            baseXP,
            bonusXP,
            totalXP,
            levelUp,
            newBadges,
            activatedSkills, // ✅ Send activated skills
            level: updatedLevel,
            task
        });

    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Error updating task status' });
    }
};

// ✅ Estimate Task Duration (COCOMO-Inspired)
const estimateTaskDurationOnly = async (req, res) => {
    const { assignedTo, complexity, effortEstimate } = req.body;

    if (!assignedTo || !complexity || !effortEstimate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const user = await User.findById(assignedTo);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const complexityFactor = { Low: 1.0, Medium: 1.2, High: 1.5 };
        const experienceFactor = { Junior: 1.2, Mid: 1.0, Senior: 0.8 };

        const base = effortEstimate * complexityFactor[complexity];
        const estimatedDuration = base * experienceFactor[user.experienceLevel];

        return res.status(200).json({
            estimatedDuration: `${estimatedDuration.toFixed(2)} hours`
        });
    } catch (error) {
        console.error('Estimation Error:', error);
        res.status(500).json({ error: 'Failed to estimate task duration' });
    }
};



module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject,
    updateTaskStatus,
    estimateTaskDurationOnly,
};
