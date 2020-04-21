const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);