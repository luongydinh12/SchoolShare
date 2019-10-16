import React from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { connect } from "react-redux";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';


class Calendar extends React.Component {
  calendarComponentRef = React.createRef()
  constructor(){
    super();
    this.state = {
      calendarWeekends: true,
      calendarEvents: [],
      show: false, 
      date: null,
      allDay: null,
      title:'def',
      desc:'',
    }

  }
  componentDidMount = () => {
    axios.get('/api/calendar/getallevents?user=' + this.props.auth.user.id)
        .then(result => {
            this.setState({ calendarEvents: result.data.data })
        })
        .catch(err => {
            //this.setState({ loading: false, error: true })
        })
  }
 
  joinGroup = e => {
    const id = this.props.location.pathname.split('/')[3]
    axios.get('/api/groups/joingroup?user=' + this.props.auth.user.id + '&id=' + id + '&name=' + this.props.auth.user.name)
        .then(result => {
            this.fetchChats();
        })
        .catch(err => {
            console.log('Something went wrong')
        })
  } 
  handleSubmit = e => {
    this.setState({  // add new event data
      calendarEvents: this.state.calendarEvents.concat({ // creates a new array
        title: this.state.title,
        desc: this.state.desc,
        start: this.state.date,
        allDay: this.state.allDay
      }),
      show: false
    }) 
    axios.get('/api/calendar/newevent?title='+ this.state.title + 'desc='+this.state.desc+'start='+this.state.date+ 'allDay='+this.state.allDay+ 'user=' + this.props.auth.user.id)
        .then(result => {
            
        })
        .catch(err => {
            console.log('Something went wrong')
        })
    
  }
  render() {
    
    //const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    
    return (  
      <div>
        <Modal show={this.state.show} onHide={this.handleClose.bind(this)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>           
              Title: &nbsp; 
              <input id="event_title" type="text"  onBlur={this.handleTitleOnBlur.bind(this)}/>
            </label>
            
            <br/><br/>
            <label>
              &nbsp;Description:
            </label>
            <textarea  onChange={this.handleDescOnBlur.bind(this)} />
              
          </Modal.Body>
          <Modal.Footer>     
            <Button variant="primary" onClick={this.handleSubmit.bind(this)}>
              Save
            </Button>
            &nbsp;
            &nbsp;
            <Button variant="secondary" onClick={this.handleClose.bind(this)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
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

  handleClose () {
    this.setState({
      show: false
    });
  }
  

  

  handleClick = (event) => {
    this.setState({ 
      open:true
    })
  }
  handleDateClick = (arg) => {  
    if (window.confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.setState({ 
        date: arg.date,
        allDay: arg.allDay,  
        show: true
      })
    }   
  } 
  
  handleDescOnBlur(event) {
    this.setState({
      desc: event.target.value
    });
  } 

  handleTitleOnBlur(event) {
    this.setState({ 
      title: event.target.value
    });
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Calendar);
