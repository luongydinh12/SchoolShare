const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CommentLikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }
}, { timestamps: true });
var Comment = mongoose.model("commentlike", CommentLikeSchema);
module.exports = Comment 