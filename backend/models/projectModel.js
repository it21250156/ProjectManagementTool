const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)