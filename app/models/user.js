// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    user_id: { type: String, required: true, unique: true },
    name: String,
    age: Number,
    job: String
});

module.exports = mongoose.model('User', UserSchema);