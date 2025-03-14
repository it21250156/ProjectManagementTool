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
    days: {
        type: Number,
    },
    assignedTo: {
        type: String,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)