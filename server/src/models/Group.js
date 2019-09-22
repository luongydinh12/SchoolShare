const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  desc: {
    type: String
  },
  messageId: [{
    type: Schema.Types.ObjectId,
    ref: 'messages'
  }],
  catId: {
    type: Schema.Types.ObjectId,
    ref: 'groupcategories',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  }],
  membersName: [{
    type: String,
    required: true,
  }]
});
var Group = mongoose.model("groups", GroupSchema)
module.exports= Group