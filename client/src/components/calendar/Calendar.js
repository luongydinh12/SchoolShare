import React from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { connect } from "react-redux";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';
import M from 'materialize-css'


class Calendar extends React.Component {
  calendarComponentRef = React.createRef()
  constructor() {
    super();
    this.state = {
      calendarWeekends: true,
      calendarEvents: [],
      date: '',
      allDay: null,
      title: 'def',
      desc: '',
    }

  }
  componentDidMount = () => {
    this.updateCalendar()
  }

  updateCalendar = () => {
    axios.get('/api/calendar/getallevents?user=' + this.props.auth.user.id)
      .then(result => {
        console.log(result.data.data)
        this.setState({ calendarEvents: result.data.data })
      })
      .catch(err => {
        console.log(err)
        //this.setState({ loading: false, error: true })
      })
  }
  handleSubmit = (e) => {
    axios.post('/api/calendar/newevent', {
      title: this.state.title,
      start: this.state.date,
      desc: this.state.desc,
      allDay: this.state.allDay,
      user: this.props.auth.user.id
    })
      .then(result => {
        this.setState({date:null,allDay:null,title:null,def:null})
      })
      .catch(err => {
        console.log('Something went wrong')
      })

    this.updateCalendar()
  }
  openModal = (e) => {
    M.Modal.init(document.querySelector('.modal')).open()
  }
  render() {
    return (
      <div>
        <div className='modal'>
          <div className='modal-content'>
            <h4>Event</h4>
            <div className="input-field col s12">
              <input disabled value={this.state.date} id="date" type="text" />
            </div>
            <div className="input-field col s6">
              <input id="event_title" type="text" onChange={this.handleTitleOnChange} />
              <label htmlFor="event_title">Event Title</label>
            </div>
            <div className="input-field col s6">
              <textarea id="event_desc" className="materialize-textarea" onChange={this.handleDescOnChange} />
              <label htmlFor="event_desc">Event Details</label>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-red btn-flat" onClick={this.handleSubmit}>Save</button>
            <button className="modal-close waves-effect waves-green btn-flat">Close</button>
          </div>
        </div>
        <FullCalendar
          defaultView="dayGridMonth"
          header={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={this.calendarComponentRef}
          weekends={this.state.calendarWeekends}
          events={this.state.calendarEvents}
          dateClick={this.handleDateClick}
        />
      </div>
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
    console.log(arg.dateStr)
    this.setState({
      date: arg.date,
      allDay: arg.allDay,
    })
    console.log(this.state)
    this.openModal()
  }

  handleDescOnChange = (event) => {
    this.setState({
      desc: event.target.value
    })
  }

  handleTitleOnChange = (event) => {
    this.setState({
      title: event.target.value
    });
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Calendar);
