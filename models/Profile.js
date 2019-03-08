const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ProfileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  profilepic: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
});
module.exports = User = mongoose.model("profiles", ProfileSchema);