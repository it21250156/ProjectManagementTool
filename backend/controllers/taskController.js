const mongoose = require('mongoose');
const Task = require('../models/taskModel');

// Get all Tasks
const getAllTasks = async (req, res) => {
    try {
        const task = await Task.find({});
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Task
const getTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Task ID' });
    }

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Create a Task
const createTask = async (req, res) => {
    const { taskName, dueDate, assignedTo, project, priority } = req.body;

    try {
        const task = await Task.create({ taskName, dueDate, assignedTo, project, priority });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a Task
const updateTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findByIdAndUpdate({ _id: id }, {
        ...req.body
    });

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
};

// Delete a Task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Task ID' });
    }

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTasksByProject = async (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: 'Invalid Project ID' });
    }

    try {
        const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name'); // Populate assignedTo with user's name
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const User = require('../models/userModel'); // Import the User model

const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await Task.findById(id).populate('assignedTo', 'name');
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.status === "Completed") {
            return res.status(400).json({ error: "Task is already completed!" });
        }

        let pointsEarned = 0; // ✅ Define here so it is accessible throughout

        // ✅ Only assign points if the task is completed
        if (status === "Completed") {
            const assignedUser = await User.findById(task.assignedTo);
            if (!assignedUser) {
                return res.status(404).json({ error: 'Assigned user not found' });
            }

            // ✅ Assign points based on priority
            switch (task.priority) {
                case "High": pointsEarned = 10; break;
                case "Medium": pointsEarned = 5; break;
                case "Low": pointsEarned = 3; break;
                default: pointsEarned = 0;
            }

            // ✅ Update user stats
            assignedUser.points += pointsEarned;
            assignedUser.earnedXP += pointsEarned;
            assignedUser.completedTasks += 1;
            assignedUser.level = Math.floor(assignedUser.earnedXP / 50) + 1;

            await assignedUser.save();
        }

        // ✅ Update task status
        task.status = status;
        await task.save();

        // ✅ Proper response
        return res.status(200).json({
            message: `Task marked as ${status}. ${status === "Completed" ? `+${pointsEarned} XP awarded!` : ''}`,
            updatedTask: task
        });

    } catch (error) {
        console.error("Error updating task status:", error);
        return res.status(500).json({ error: "Server error while updating task" });
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
