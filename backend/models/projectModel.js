const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  points: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  deadline: { type: Date, required: true }, // ✅ Added task deadline
});

const MemberSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tasks: [TaskSchema],
});

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectId: { type: String, required: true, unique: true },
  members: [MemberSchema],
});

// ✅ Middleware to check overdue tasks
ProjectSchema.pre('save', function (next) {
  this.members.forEach((member) => {
    member.tasks.forEach((task) => {
      if (new Date(task.deadline) < new Date() && !task.completed) {
        console.log(`Task "${task.task}" is overdue!`);
      }
    });
  });
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
