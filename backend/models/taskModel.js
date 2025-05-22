const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskName: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Testing', 'Completed']
  },
  priority: {
    type: String,
    default: 'Low',
    enum: ['Low', 'Medium', 'High']
  },
  complexity: {
    type: String,
    default: 'Low',
    enum: ['Low', 'Medium', 'High']
  },
<<<<<<< HEAD
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
}, { timestamps: true });

=======
  effortEstimate: {
    type: Number,
    required: true
  },

  estimatedDuration: {
    type: Number, 
    required: false
  },  
  
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
}, { timestamps: true });

>>>>>>> 7f08e11da2ffb0c9f8a668ad637a77e91e5ae7c8
module.exports = mongoose.model('Task', taskSchema);
