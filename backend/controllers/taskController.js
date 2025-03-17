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

// ✅ Create a Task
const createTask = async (req, res) => {
    const { taskName, dueDate, assignedTo, project, priority } = req.body;

    try {
        const task = await Task.create({ taskName, dueDate, assignedTo, project, priority });
        res.status(201).json(task);
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

// ✅ Update Task Status & Apply Gamification XP
const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await Task.findById(id).populate('assignedTo', 'name');

        if (!task) return res.status(404).json({ error: 'Task not found' });

        let totalXP = 0; // ✅ Ensure `totalXP` is always defined
        let baseXP = 0;
        let bonusXP = 0;

        if (status === "Completed") {
            const user = await User.findById(task.assignedTo).populate('unlockedSkills');
            if (!user) return res.status(404).json({ error: 'User not found' });

            // ✅ Determine Base XP from Priority
            switch (task.priority.toLowerCase()) {
                case 'high': baseXP = 10; break;
                case 'medium': baseXP = 5; break;
                case 'low': baseXP = 3; break;
                default: baseXP = 5;
            }

            const now = dayjs();

            // ✅ Apply Skill Effects
            if (user.unlockedSkills.some(skill => skill.name === "Early Bird") && now.hour() < 12) {
                bonusXP += 3;
            }
            if (user.unlockedSkills.some(skill => skill.name === "Night Owl") && now.hour() >= 20) {
                bonusXP += 3;
            }
            if (user.unlockedSkills.some(skill => skill.name === "Fast Finisher")) {
                bonusXP += 2;
            }
            if (user.unlockedSkills.some(skill => skill.name === "Deadline Master") && now.isBefore(dayjs(task.dueDate))) {
                bonusXP += baseXP; // Double XP for early completion
            }

            // ✅ Calculate Total XP
            totalXP = baseXP + bonusXP;

            // ✅ Update User XP & Level
            user.earnedXP += totalXP;
            user.points += baseXP;
            user.completedTasks += 1;

            await user.save();
        }

        // ✅ Update Task Status
        task.status = status;
        await task.save();

        res.status(200).json({ 
            message: `Task completed! Total XP: ${totalXP} (Base: ${baseXP}, Bonus: ${bonusXP})`, 
            task 
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Error updating task status' });
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
};
