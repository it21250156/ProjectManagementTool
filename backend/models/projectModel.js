const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  points: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  deadline: { type: Date, required: true },
});

const MemberSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tasks: [TaskSchema],
});

const ProjectSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    unique: true, 
    default: () => new mongoose.Types.ObjectId().toString() // ✅ Auto-generate projectId
  },
  projectName: { type: String, required: true },
  projectDescription: { type: String, default: "" }, // ✅ Allow empty description
  startDate: { type: Date, required: true }, // ✅ Added required start date
  members: [MemberSchema],
});

// ✅ Middleware: Check overdue tasks only on updates
ProjectSchema.pre('save', function (next) {
  if (this.isNew) return next(); // Only check for updates

  this.members.forEach(member => {
    member.tasks.forEach(task => {
      if (new Date(task.deadline) < new Date() && !task.completed) {
        console.warn(`⚠️ Task "${task.task}" (ID: ${task._id}) is overdue!`);
      }
    });
  });

  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
