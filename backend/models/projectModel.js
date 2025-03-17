const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  projectName: { type: String, required: true },
  projectDescription: { type: String, default: "" },
  start_date: { type: Date, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Fields required for predictions
  team_size: { type: Number, required: false },
  task_count: { type: Number, required: false },
  developer_experience: { type: Number, required: false },
  priority_level: { type: Number, required: false },
  task_complexity: { type: Number, required: false },
  project_size: { type: Number, required: false },
  testing_coverage: { type: Number, required: false },
  Effort_Density: { type: Number, required: false },
  Team_Productivity: { type: Number, required: false },
  LoC_per_Team_Member: { type: Number, required: false },
  change_impact_factor: { type: Number },
  requirement_changes: { type: Number, required: false },

  // Defect prediction fields
  defect_fix_time_minutes: { type: Number, required: false },
  size_added: { type: Number, required: false },
  size_deleted: { type: Number, required: false },
  size_modified: { type: Number, required: false },
  effort_hours: { type: Number, required: false },
  complexity_score: { type: Number, required: false },
  team_key: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);