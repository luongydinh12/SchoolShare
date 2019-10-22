const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ThreadSchema = new Schema({
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
  },
  saves:[{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }]
}, { timestamps: true });
var Thread = mongoose.model("thread", ThreadSchema)
module.exports = Thread