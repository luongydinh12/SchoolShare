const mongoose = require("mongoose");
import Profile from './Profile'
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  googleId: {
    type: String,
    required: false
  },
  facebookId: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    required: false,
    default: "uploads/15743941465812.png"
  },
  description: {
    type: String,
    required: false
  },
  messageId: [{
    type: Schema.Types.ObjectId,
    ref: 'messages'
  }],
  calendarEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'calendarevents'
  }]
});
UserSchema.methods.getUserProfile= function(cb){ //if cb is null,returns promise
  return Profile.findOne({user:this._id}).exec(cb) 
}
var User = mongoose.model("users", UserSchema)
module.exports = User