const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  googleId:{
    type:String,
    required:false
  },
  facebookId:{
    type:String,
    required:false
  },
  avatar:{
    type: String,
    required: false,
    default: "https://res.cloudinary.com/geekysrm/image/upload/v1542221619/default-user.png"
  },
  description:{
    type: String,
    required: false
  },
});
module.exports = User = mongoose.model("users", UserSchema);