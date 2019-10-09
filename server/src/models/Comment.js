const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CommentSchema = new Schema({
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
<<<<<<< HEAD
  }
=======
  },
  deleted: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'commentlike'
  }]
>>>>>>> Development
}, { timestamps: true });
var Comment=mongoose.model("comment", CommentSchema)
module.exports = Comment