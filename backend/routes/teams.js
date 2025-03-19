const express = require('express');
const mongoose = require('mongoose');
const Team = require('../models/teamModel'); // Import Team model

const router = express.Router();

// ✅ Create a new team
router.post('/', async (req, res) => {
    const { team_id, team_name, team_experience_level, total_members, past_projects_completed, specialization, team_skillset_match, team_availability } = req.body;

    try {
        // ✅ Validate input
        if (!team_id || !team_name || team_experience_level === undefined || total_members === undefined ||
            past_projects_completed === undefined || !specialization || team_skillset_match === undefined || team_availability === undefined) {
            return res.status(400).json({ status: 'error', message: 'Invalid team data. All fields are required.' });
        }

        // ✅ Check if the team ID already exists
        const existingTeam = await Team.findOne({ team_id });
        if (existingTeam) {
            return res.status(400).json({ status: 'error', message: 'A team with this ID already exists.' });
        }

        // ✅ Create and save the new team
        const newTeam = new Team({
            team_id,
            team_name,
            team_experience_level,
            total_members,
            past_projects_completed,
            specialization,
            team_skillset_match,
            team_availability
        });

        await newTeam.save();
        res.status(201).json({ status: 'success', message: 'Team created successfully!', team: newTeam });

    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ status: 'error', message: 'Server error while creating team' });
    }
});

// ✅ Get all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json({ status: 'success', data: teams });
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ status: 'error', message: 'Server error while fetching teams' });
    }
});

// ✅ Get a single team by team_id
router.get('/:team_id', async (req, res) => {
    try {
        const team = await Team.findOne({ team_id: req.params.team_id });

        if (!team) {
            return res.status(404).json({ status: 'error', message: 'Team not found' });
        }

        res.status(200).json({ status: 'success', data: team });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ status: 'error', message: 'Server error while fetching team' });
    }
});

// ✅ Update a team by team_id
router.put('/:team_id', async (req, res) => {
    try {
        const updatedTeam = await Team.findOneAndUpdate(
            { team_id: req.params.team_id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({ status: 'error', message: 'Team not found' });
        }

        res.status(200).json({ status: 'success', message: 'Team updated successfully!', data: updatedTeam });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ status: 'error', message: 'Server error while updating team' });
    }
});

// ✅ Delete a team by team_id
router.delete('/:team_id', async (req, res) => {
    try {
        const deletedTeam = await Team.findOneAndDelete({ team_id: req.params.team_id });

        if (!deletedTeam) {
            return res.status(404).json({ status: 'error', message: 'Team not found' });
        }

        res.status(200).json({ status: 'success', message: 'Team deleted successfully!', data: deletedTeam });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ status: 'error', message: 'Server error while deleting team' });
    }
});

module.exports = router;