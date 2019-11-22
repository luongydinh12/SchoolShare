
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme, createMuiTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import clsx from 'clsx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Link as RouterLink } from 'react-router-dom';
import { logoutUser } from "../../actions/authActions";
import { EditProfileButton } from './NavBarButtons';
import { red } from '@material-ui/core/colors';
import { loadCSS } from 'fg-loadcss';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import NavigationIcon from '@material-ui/icons/Navigation';
import Fab from '@material-ui/core/Fab';
import grey from '@material-ui/core/colors/grey';
import GroupIcon from '@material-ui/icons/Group';
import ForumIcon from '@material-ui/icons/Forum';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#ffffff',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const drawerWidth = 240;
// const options = [
//   'EDIT PROFILE',
//   'DELETE',
//   'CALENDER',
//   'LOG OUT',
// ];

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
    color: grey[50],
  },
  button: {
    margin: theme.spacing(1),
    color: grey[50],
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    color: grey[50],
  },
  input: {
    display: 'none',
  },
  root: {
    display: 'flex',
    flexGrow: 1,
    paddingBottom: 150
  },
  iconHover: {
    '&:hover': {
      color: red[300],
    },},
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

  
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );
  }, []);

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
          
          {/* <Link to="/private-chat" className="btn waves-effect waves-light hoverable white" style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "2rem",
            marginBottom: "1.4rem",
            color: "black"
          }}>
            Private Chat
              </Link> */}
              
          {/* <IconButton className={classes.button} aria-label="delete"><AccountBalanceIcon /> </IconButton>
          <IconButton className={classes.button} aria-label="delete" disabled color="primary"><DeleteIcon /></IconButton>
          <IconButton color="secondary" className={classes.button} aria-label="add an alarm"><AlarmIcon /> </IconButton>
          <IconButton 
              color="primary" 
              className={classes.button} aria-label="calendar"><EventAvailableIcon /></IconButton>
          <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              className={classes.button}
              aria-label="upload picture"
              component="span"
              ><PhotoCamera />
            </IconButton>
          </label> */}
          

          {/* <Link
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
          </Link> */}
          <IconButton 
              href = "/calendar"
              size = 'large'
              color="inherit" 
              className={classes.button} 
              aria-label="calendar">
                <EventAvailableIcon />
          </IconButton>
          
          <IconButton 
              href = "/profilelist"
              size = 'large'
              color="inherit" 
              className={classes.button} 
              aria-label="group">
                <GroupIcon />
          </IconButton>

          <IconButton 
              href = "/private-chat"
              size = 'large'
              color="inherit" 
              className={classes.button} 
              aria-label="forum">
                <ForumIcon />
          </IconButton>
        
          <Fab
              href="/forum"
              variant="extended"
              size="small"
              color="primary"
              aria-label="add"
              className={classes.margin}
              >
            <NavigationIcon className={classes.extendedIcon} />
            Forum
          </Fab>
          
          {/* <Link
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
          </Link> */}
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