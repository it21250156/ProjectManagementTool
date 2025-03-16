const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  projectName: { type: String, required: true },
  projectDescription: { type: String, default: "" },
  startDate: { type: Date, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User ObjectIds
});

module.exports = mongoose.model('Project', ProjectSchema); ""