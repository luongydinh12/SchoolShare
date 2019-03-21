/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GroupSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  description: {
    type: String
  },
  class: [
    {
      title: {
        type: String,
        required: true
      },
      term: {
        type: String,
        required: true
      },
      room: {
        type: String
      },
      current: {
        type: Boolean,
        //default: false
      },
      description: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('group', GroupSchema);*/

/*
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  desc: {
    type: String
  },
  messageId: [{
    type: Schema.Types.ObjectId,
    ref: 'messages'
  }],
  catId: {
    type: Schema.Types.ObjectId,
    ref: 'groupcategories',
    required: true
  }
});
module.exports = Group = mongoose.model("groups", GroupSchema);*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  desc: {
    type: String
  },
  messageId: [{
    type: Schema.Types.ObjectId,
    ref: 'messages'
  }],
  catId: {
    type: Schema.Types.ObjectId,
    ref: 'groupcategories',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  }],
  membersName: [{
    type: String,
    required: true,
  }]
});
module.exports = Group = mongoose.model("groups", GroupSchema);