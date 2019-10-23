
import React, { Component } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import { Link as RouterLink } from 'react-router-dom';

import MoreVertIcon from '@material-ui/icons/MoreVert';
// for calendar
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';

const drawerWidth = 240;
// const options = [
//   'EDIT PROFILE',
//   'DELETE',
//   'CALENDER',
//   'LOG OUT',
// ];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));



export default () => {
  const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
      setOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };
  const classes = useStyles();
  return (
    <div className={classes.root}>
    <CssBaseline />
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <RouterLink to="/dashboard">
          {/* <img
          width="200"
          alt="School Share"
          src="/images/logos/logo--white.png"
          /> */}
        </RouterLink>
          <Typography variant="h6" className={classes.title}>
            School Share
          </Typography>
          <Link to="/groups" className="btn waves-effect waves-light hoverable green accent-3" style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "2rem",
            marginBottom: "1.4rem",
            // color:"black"
          }}>
            Groups
              </Link>

          <Link to="/forum" className="btn waves-effect waves-light hoverable green accent-3" style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "2rem",
            marginBottom: "1.4rem",
            marginLeft: 16,
          }}>
            FORUM
              </Link>
          <Link to="/calendar" className="btn waves-effect waves-light hoverable green accent-3" style={{
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
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        
        <List>
          {['Edit', 'View calender', 'Log out', 'Delete'].map((text, index) => (

<Link to="/edit-profile" className= " accent-3" style={{
  width: "200px",
  borderRadius: "3px",
  letterSpacing: "1.5px",
  marginTop: "2rem"
}}>
{/*
 <Link to="/Log out" className= " accent-3" style={{
  width: "200px",
  borderRadius: "3px",
  letterSpacing: "1.5px",
  marginTop: "2rem",
  marginLeft: "1rem"
}}></Link>

<Link to="/Delete " className= " accent-3" style={{
  width: "200px",
  borderRadius: "3px",
  letterSpacing: "1.5px",
  marginTop: "2rem",
  marginLeft: "1rem"
}}> */}

            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
            </Link>
            // </Link>
            // </Link>
          ))}
        </List>
        <Divider />
        {/* <List>
          {['Edit', 'View calender', 'Log out', 'Delete'].map((text, index) => (
            

         <Link to="/Forum" className= " accent-3" style={{
          width: "150px",
          borderRadius: "3px",
          letterSpacing: "1.5px",
          marginTop: "2rem",
          marginBottom: "1.4rem",
          marginLeft: 16,
        }}>
          <Link to="/Log out" className=" accent-3" style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "2rem",
            marginBottom: "1.4rem",
            marginLeft: 16,
            
          }}>
            <Link to="/Delete" className=" accent-3" style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "2rem",
            marginBottom: "1.4rem",
            marginLeft: 16,
          }}></Link>
            
         
            <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
            </Link>
            </Link>
          ))}
        </List> */}
      </Drawer>
    </div>
  );
}
