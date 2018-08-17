// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FollowsrSchema   = new Schema({
    user_id: { type: String, required: true},
    follow_id: { type: String, required: true}
});

module.exports = mongoose.model('Follows', FollowsrSchema);