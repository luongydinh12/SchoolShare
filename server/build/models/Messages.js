"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema; // Create Schema

var MessagesSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    "default": Date.now
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
var Messages = mongoose.model("messages", MessagesSchema);
module.exports = Messages;