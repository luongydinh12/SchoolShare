import React from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import './main.scss' // webpack must be configured to do this

class Calendar extends React.Component {

  render() {
    return (
      
      <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin ]} />
    )
  }

}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Calendar);
