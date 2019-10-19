const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const CalendarEventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
  },
  date: {
    type: Date,
    required: true
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