"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema; // Create Schema

var CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  content: {
    type: String
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: 'thread'
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'comment'
  },
  deleted: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});
var Comment = mongoose.model("comment", CommentSchema);
module.exports = Comment;