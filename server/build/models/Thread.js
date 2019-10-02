"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema; // Create Schema

var ThreadSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  content: {
    type: String
  },
  category: {
    type: String
  }
}, {
  timestamps: true
});
var Thread = mongoose.model("thread", ThreadSchema);
module.exports = Thread;