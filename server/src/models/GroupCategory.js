const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const GroupCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  groupId: [{
    type: Schema.Types.ObjectId,
    ref: 'groups'
  }]
});
var GroupCategory = mongoose.model("groupcategories", GroupCategorySchema)
module.exports=GroupCategory