'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
  privkey: {
    type: String,
    required: 'Kindly enter the privkey of the task'
  },
  pubkey: {
    type: String,
    required: 'Kindly enter the pubkey of the task'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  allowed : {
    type: [{
      type: Boolean,
    }],
    default: false
  }
});

module.exports = mongoose.model('Tasks', TaskSchema);
