const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

// Get all Projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Project
const getProject = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Project ID' });
    }

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a Project
const createProject = async (req, res) => {
    const { projectName, projectDescription } = req.body;

    try {
        const project = await Project.create({ projectName, projectDescription });
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a Project
const updateProject = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Project ID' });
    }

    try {
        const project = await Project.findByIdAndUpdate({ _id: id }, {
            ...req.body
        }, { new: true });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a Project
const deleteProject = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Project ID' });
    }

    try {
        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMembersForProject = async (req, res) => {
    const { projectId } = req.params;

    console.log("Fetching members for project ID:", projectId); // Debugging

    try {
        // Find the project
        const project = await Project.findById(projectId);
        console.log("Project found:", project); // Debugging

        if (!project) {
            console.log("Project not found"); // Debugging
            return res.status(404).json({ error: "Project not found" });
        }

        // Extract member IDs from the project
        const memberIds = project.members; // Directly use the members array
        console.log("Member IDs:", memberIds); // Debugging

        // Fetch user details for the member IDs
        const members = await User.find({ _id: { $in: memberIds } }).select("name email");
        console.log("Members found:", members); // Debugging

        // Debugging: Check if memberIds are valid ObjectIds
        console.log("Are memberIds valid ObjectIds?", memberIds.every(id => mongoose.Types.ObjectId.isValid(id)));

        // Debugging: Check if any users exist with the given IDs
        const userCount = await User.countDocuments({ _id: { $in: memberIds } });
        console.log("Number of users found:", userCount);

        res.status(200).json(members);
    } catch (error) {
        console.error("Error fetching members:", error); // Debugging
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getMembersForProject,
};