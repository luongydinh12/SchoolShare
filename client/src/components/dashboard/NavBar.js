
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, deleteUser } from "../../actions/authActions";
import moment from 'moment'; //npm install moment --save (CLIENT)
import { Link } from 'react-router-dom';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';

import MoreVertIcon from '@material-ui/icons/MoreVert';
// for calendar
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';


const options = [
  'EDIT PROFILE',
  'DELETE',
  'CALENDER',
  'LOG OUT',
];

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default () => {
  
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon /> 
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Menu
          </Typography>
          <Link to="/groups" className="btn waves-effect waves-light hoverable blue accent-3" style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "2rem",
            marginBottom: "1.4rem",
          }}>
            Groups
              </Link>

          <Link to="/forum" className="btn waves-effect waves-light hoverable blue accent-3" style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "2rem",
            marginBottom: "1.4rem",
            marginLeft: 16,
          }}>
            FORUM
              </Link>
          <Link to="/calendar" className="btn waves-effect waves-light hoverable blue accent-3" style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "2rem",
            marginBottom: "1.4rem",
            marginLeft: 16,
          }}>
            CALENDAR
              </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
