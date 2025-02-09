const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskSchema = new Schema({
    taskName: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        required: true,
    },
    assignedTo: {
        type: String,
    },
}, {timestamps: true})

module.exports = mongoose.model('Task', taskSchema)