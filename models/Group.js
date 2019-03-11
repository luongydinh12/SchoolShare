const mongoose = require('mongoose');
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

module.exports = Profile = mongoose.model('group', GroupSchema);
