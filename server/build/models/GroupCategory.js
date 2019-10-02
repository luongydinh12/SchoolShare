"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema; // Create Schema

var GroupCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    "default": Date.now
  },
  groupId: [{
    type: Schema.Types.ObjectId,
    ref: 'groups'
  }]
});
var GroupCategory = mongoose.model("groupcategories", GroupCategorySchema);
module.exports = GroupCategory;