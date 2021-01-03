const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    },
    date: {
    type: Date,
    default: Date.now
  }
    
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

