import React from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import NavBar from '../dashboard/NavBar'

//import './main.scss' // webpack must be configured to do this

class Calendar extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    calendarWeekends: true,
    calendarEvents: [ // initial event data
      { title: 'Event Now', start: new Date() }
    ]
  }
  render() {
    return (
      <FullCalendar
        defaultView="dayGridMonth"
        header={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        ref={ this.calendarComponentRef }
        weekends={ this.state.calendarWeekends }
        events={ this.state.calendarEvents }
        dateClick={ this.handleDateClick }
        />

    )

  }
  toggleWeekends = () => {
    this.setState({ // update a property
      calendarWeekends: !this.state.calendarWeekends
    })
  }

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi()
    calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
  }

  handleDateClick = (arg) => {
    if (window.confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.setState({  // add new event data
        calendarEvents: this.state.calendarEvents.concat({ // creates a new array
          title: 'New Event',
          start: arg.date,
          allDay: arg.allDay
        })
      })
    }
  }

}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Calendar);
