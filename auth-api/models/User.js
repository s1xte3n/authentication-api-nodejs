// #1 Import mongoose
const mongoose = require('mongoose');

// #2 Define user schema 
const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required
    }
});

// #3 Export model
module.exports = mongoose.model('User', UserSchema);