const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Skill name
  description: { type: String, required: true }, // Short description
  branch: { type: String, enum: ['task_management', 'collaboration', 'productivity', 'analytics'], required: true }, // Skill category
  tier: { type: Number, required: true }, // 1-4, determines unlock order
  pointsRequired: { type: Number, required: true }, // Points needed to unlock
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }], // Skills that must be unlocked first
});

module.exports = mongoose.model('Skill', SkillSchema);
