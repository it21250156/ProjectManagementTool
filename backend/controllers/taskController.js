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
    const { taskName, days, assignedTo, project } = req.body;

    try {
        const task = await Task.create({ taskName, days, assignedTo, project });
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

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};
