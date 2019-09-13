const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const MessagesSchema = new Schema({
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
    ref: 'users'
  },
  createdByName: {
    type: String,
    required: true
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'groups',
    required: true
  }
});
module.exports = Messages = mongoose.model("messages", MessagesSchema);