const mongoose = require('mongoose');

const TODO = mongoose.model('Todos', {
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }, 
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number
    }
});

module.exports = {TODO};
