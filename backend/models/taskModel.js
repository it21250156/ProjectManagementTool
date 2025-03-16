const mongoose = require('mongoose')

const Schema = mongoose.Schema

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
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)