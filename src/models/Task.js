const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
    title: String,
    description: String
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('Task', taskSchema);