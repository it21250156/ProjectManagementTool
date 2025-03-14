const express = require('express');

const {
    getAllProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject
} = require("../controllers/projectController");

const router = express.Router();

// Get all Projects
router.get('/', getAllProjects);

// Get a single Project
router.get('/:id', getProject);

// Create a Project
router.post('/add', createProject);

// Delete a Project
router.delete('/delete/:id', deleteProject);

// Update a Project
router.patch('/update/:id', updateProject);

module.exports = router;