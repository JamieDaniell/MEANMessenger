var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var schema = new Schema({
    content: {type: String , required: true},
    user: {type: mongoose.Schema.Types.ObjectId , ref: "User" }
});

schema.post('remove', function(message)
{
    User.findById(message.user, function(error, user)
    {
        user.messages.pull(message);
        user.save();
    });
});

module.exports = mongoose.model("Message", schema);