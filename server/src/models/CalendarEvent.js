const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const CalendarEventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  allDay: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
});
var CalendarEvent = mongoose.model("calendarevents", CalendarEventSchema)
module.exports = CalendarEvent