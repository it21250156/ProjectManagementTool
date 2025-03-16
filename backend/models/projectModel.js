const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  projectName: { type: String, required: true },
  projectDescription: { type: String, default: "" },
  startDate: { type: Date, required: true },
  members: [MemberSchema],
});

module.exports = mongoose.model('Project', ProjectSchema);
