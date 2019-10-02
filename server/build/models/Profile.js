"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema; // Create Schema

var ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  description: {
    type: String
  },
  "class": [{
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
      type: Boolean //default: false

    },
    description: {
      type: String
    }
  }],
  date: {
    type: Date,
    "default": Date.now
  }
});
var Profile = mongoose.model('profile', ProfileSchema);
module.exports = Profile;