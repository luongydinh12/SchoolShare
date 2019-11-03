const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const GroupChatMessagesSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'profile',
    required:true
  },
  groupChatId: {
    type: Schema.Types.ObjectId,
    ref: 'groupChats',
    required: true
  }
});
var Messages = mongoose.model("groupChatMessages", GroupChatMessagesSchema)
module.exports = Messages