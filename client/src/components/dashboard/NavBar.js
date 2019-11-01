
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import clsx from 'clsx';
import React,{Component} from 'react';
import { Link, Link as RouterLink } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {connect} from 'react-redux'
import { logoutUser } from "../../actions/authActions"
import {EditProfileButton} from './NavBarButtons'
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
    backgroundColor: "#2BB673",
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
          [classes.appBarShift]: open
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
          <div></div>
          <RouterLink to="/dashboard" >
            <img width="200" alt="Logo" src="/images/logos/logo--white.png" />
          </RouterLink>
          <Typography variant="h6" className={classes.title}></Typography>
          <Link
            to="/groups"
            className="btn waves-effect waves-light hoverable blue accent-3"
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "2rem",
              marginBottom: "1.4rem"
              // color:"black"
            }}
          >
            Groups
          </Link>

          <Link
            to="/forum"
            className="btn waves-effect waves-light hoverable blue accent-3"
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "2rem",
              marginBottom: "1.4rem",
              marginLeft: 16
            }}
          >
            FORUM
          </Link>
          <Link
            to="/calendar"
            className="btn waves-effect waves-light hoverable blue accent-3"
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "2rem",
              marginBottom: "1.4rem",
              marginLeft: 16
            }}
          >
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
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />

        <List>
          

          <EditProfileButton />

          <ListItem button key={"text1"}>
            <ListItemIcon>
            <InboxIcon />
              {/* <DeleteForeverIcon /> */}
            </ListItemIcon>
            <ListItemText primary={"Delete Account"} />
          </ListItem>


          {/* <ListItem button key={"text2"}>
            <ListItemIcon>
            <InboxIcon />
               <ExitToAppIcon /> 
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItem> */}

          <LogOutButton />

        </List>
        <Divider />
      </Drawer>
    </div>
  );
}



class LogOutButton extends Component {
  onLogoutClick = e => {
      e.preventDefault()
      this.props.logoutUser()
  }
  render() {
      return (
          <ListItem button key={"text1"} onClick={this.onLogoutClick}>
              <ListItemIcon>
                  <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Log Out"} />
          </ListItem>
      )
  }
}

LogOutButton = connect(
  (state) => ({
      auth: state.auth
  }),
  { logoutUser }
)(LogOutButton)