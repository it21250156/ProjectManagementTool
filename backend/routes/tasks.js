const express = require('express');

const {
    getAllTasks,
    getTask,
    createTask,
    deleteTask,
    updateTask,
    getTasksByProject
} = require("../controllers/taskController");

const router = express.Router();

// Get all Tasks
router.get('/', getAllTasks);

// Get a single Task
router.get('/:id', getTask);

// Create a Task
router.post('/add', createTask);

// Delete a Task
router.delete('/delete/:id', deleteTask);

// Update a Task
router.patch('/update/:id', updateTask);

router.get('/project/:projectId', getTasksByProject);

module.exports = router;
