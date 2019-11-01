import React from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { connect } from "react-redux";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';
import M from 'materialize-css'
import NavBar from '../dashboard/NavBar'

class Calendar extends React.Component {
  calendarComponentRef = React.createRef()
  constructor() {
    super();
    this.state = {
      calendarWeekends: true,
      calendarEvents: [],
      start: '',
      allDay: null,
      title: '',
      desc: '',
      curEventId: null,
      isUpdate: false
    }
  }

  componentDidMount = () => {
    this.updateCalendar()
  }

  // Update the list of events for current user
  // Call whenever the database is changed
  updateCalendar = () => {
    axios.get('/api/calendar/getallevents?user=' + this.props.auth.user.id)
      .then(result => {
        this.setState({ calendarEvents: result.data.data })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // Pop-up to create new event
  openModal = (e) => {
    M.Modal.init(document.querySelector('.modal')).open()
    document.getElementById('event_title').value = ""
    document.getElementById('event_desc').value = ""
    document.getElementById("delete_bt").disabled = true;
    this.setState({
      isUpdate: false})
  }

  // View an exist event
  viewEvent = (e) => {
    var elems = document.querySelector('.modal') 
    M.Modal.init(elems).open()
    document.getElementById('event_title').value = e.event.title
    document.getElementById('event_desc').value = e.event.extendedProps.desc
    document.getElementById("delete_bt").disabled = false;
    this.setState({
      start: e.event.start,
      allDay:e.event.allDay,
      title: e.event.title,
      desc:e.event.extendedProps.desc,
      isUpdate: true})
  }

  // Handle Save button 
 handleSubmit = (e) => {
  console.log(this.state.start)
  var api = (this.state.isUpdate) ? '/api/calendar/editevent' : '/api/calendar/newevent' 
  axios.post(api, {
    title: this.state.title,
    start: this.state.start,
    desc: this.state.desc,
    allDay: this.state.allDay,
    user: this.props.auth.user.id
  })
    .then(result => {
      
      this.setState({
        //calendarEvents: result.data.data,
        calendarWeekends: true,
        start: '',
        allDay: null,
        title: '',
        desc: '',
        curEventId: null,
        isUpdate: false
        })
      this.updateCalendar()
    })
    .catch(err => {
      console.log('Something went wrong')
    })
  }

  // Delete Event
  deleteEvent = () => { 
    const data = {
      title : this.state.title,
      start : this.state.start,
      desc : this.state.desc,
      user: this.props.auth.user.id
    }
    axios.post('/api/calendar/deleteevent', data)
    .then(res => {
        this.updateCalendar()
    })
  }
  render() {
    return (
      <div>
        <div style={{marginBottom: "4rem",}}>
          <NavBar />
        </div>
        <div className='modal'>
          <div className='modal-content'>
            <h4>Event</h4>
            <div className="input-field col s12">
              <input disabled value={this.state.start} id="date" type="text" />
            </div>
            <div className="input-field col s6">
              Event Title:
              <input id="event_title" type="text" onChange={this.handleTitleOnChange} /> 
            </div>
            
            <div className="input-field col s6">
              Event Detail:
              <textarea id="event_desc" className="materialize-textarea" onChange={this.handleDescOnChange} />
              
            </div>
          </div>
          <div className="modal-footer">
            <button id="delete_bt" className="modal-close waves-effect waves-blue btn-flat" onClick={this.deleteEvent}>Delete</button>
            <button className="modal-close waves-effect waves-red btn-flat" onClick={this.handleSubmit}>Save</button>           
            <button className="modal-close waves-effect waves-green btn-flat">Close</button>
          </div>
        </div>
        <FullCalendar
          id="calendar"
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
          eventClick={this.viewEvent}
        />
      </div>
    )
  }

  // to show weendend days or not
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
      start: arg.date,
      allDay: arg.allDay,
    })
    console.log(this.state)
    this.openModal()
  }

  // Update descripton field
  handleDescOnChange = (event) => {
    this.setState({
      desc: event.target.value
    })
  }

  // Update title field
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
