const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  description: {
    type: String
  },
  class: [
    {
      title: {
        type: String,
        required: true
      },
      term: {
        type: String,
        required: true
      },
      room: {
        type: String
      },
      current: {
        type: Boolean,
        //default: false
      },
      description: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

ProfileSchema.methods.getFriends=function(cb){
  return Friend.find({ $or: [{ profileA: this._id }, { profileB: this._id }] }).exec(cb)
}

const FriendSchema = new Schema({
  profileA: {
    type: Schema.Types.ObjectId,
    ref: 'profile',
    required:true
  },
  profileB: {
    type: Schema.Types.ObjectId,
    ref: 'profile',
    required:true
  },
  status: {
    type: String,
    required:true
  }
}
)

var Profile = mongoose.model('profile', ProfileSchema)
var Friend = mongoose.model('friend', FriendSchema)
module.exports = {Profile,Friend}
