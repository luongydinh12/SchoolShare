const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    profileA: {
      type: Schema.Types.ObjectId,
      ref: 'profile',
      required: true
    },
    profileB: {
      type: Schema.Types.ObjectId,
      ref: 'profile',
      required: true
    },
    status: {
      type: String,
      required: true
    }
  }
  )
  FriendSchema.statics.getFriendDocument = function (profileA, profileB, cb) {
    return this.findOne({
      $and: [
        { $or: [{ profileA: profileA._id }, { profileB: profileA._id }] },
        { $or: [{ profileA: profileB._id }, { profileB: profileB._id }] }
      ]
    },cb)
  }
  var Friend = mongoose.model('friend', FriendSchema)
  module.exports = Friend
