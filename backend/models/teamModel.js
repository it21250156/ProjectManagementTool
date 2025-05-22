const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    team_id: { type: String, unique: true, required: true },
    team_name: { type: String, required: true },
    team_experience_level: { type: Number, required: true, min: 1, max: 5 },
    total_members: { type: Number, required: true, min: 1 },
    past_projects_completed: { type: Number, required: true, min: 0 },
    specialization: { type: String, required: true },
    team_skillset_match: { type: Number, required: true, min: 0, max: 100 }, // Skillset match in percentage
    team_availability: { type: Number, required: true, min: 0, max: 100 } // Availability in percentage
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
