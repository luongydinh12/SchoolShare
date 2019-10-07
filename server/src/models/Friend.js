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
  FriendSchema.statics.getFriendDocument = function (profileIdA, profileIdB, cb) {
    return this.findOne({
      $and: [
        { $or: [{ profileA: profileIdA }, { profileB: profileIdA }] },
        { $or: [{ profileA: profileIdB }, { profileB: profileIdB }] }
      ]
    },cb)
  }
  var Friend = mongoose.model('friend', FriendSchema)
  module.exports = Friend
