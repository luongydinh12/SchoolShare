import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import { Provider } from "react-redux";
//import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import io from 'socket.io-client';
import { logoutUser, setCurrentUser } from "./actions/authActions";
import { clearCurrentProfile, getCurrentProfile } from './actions/profileActions';
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Calendar from "./components/calendar/Calendar";
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/dashboard/NavBar";
import Forum from "./components/forum/Forum";
import MySaves from "./components/forum/MySaves";
import CreateCategory from "./components/Groups/CreateCategory";
import Groups from "./components/Groups/Groups";
import MyGroups from "./components/Groups/MyGroups";
import Landing from "./components/layout/Landing";
import NotFound from "./components/not-found/NotFound";
import PrivateRoute, { PropsRoute } from "./components/private-route/PrivateRoute";
import PrivateChat from './components/privateChat/PrivateChat';
//import { clearCurrentProfile } from "./actions/profileActions";
import CreateProfile from "./components/profile/CreateProfile";
import EditProfile from "./components/profile/EditProfile";
import FriendsList from './components/profile/FriendsList';
import Profile from "./components/profile/Profile";
import ProfilesList from "./components/profile/ProfilesList";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";





const socket = io("http://localhost:5050/")
const chatSocket=io(`http://localhost:5050/chat`)

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  store.dispatch(getCurrentProfile())
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile())
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path={['/login', '/register', '/not-found', '', '/']} component={LandingContainer} />
              <Route component={DefaultContainer} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

const LandingContainer = () => {
  return (
    <div className='container'>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/register" component={Register} />
        <PropsRoute exact path="/login" component={Login} socket={socket}/>
        <Route exact path="/not-found" component={NotFound} />
      </Switch>
    </div>)
}
const DefaultContainer = () => {
  return (
    <div className='container'>
      <Navbar />
      <Switch>
        <PrivateRoute path="/forum" component={Forum} />
        <PrivateRoute exact path="/profile/:handle" component={Profile} />
        <PrivateRoute exact path="/profilelist" component={ProfilesList} />
        <PrivateRoute exact path="/friendslist" component={FriendsList} />
        <PrivateRoute path="/groups" component={Groups} />
        <PrivateRoute path="/calendar" component={Calendar} />
        <PrivateRoute path="/mygroups" component={MyGroups} />
        <PrivateRoute path="/mysaves" component={MySaves} />
        <PrivateRoute path="/create-category" exact component={CreateCategory} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute path="/private-chat" component={PrivateChat} socket={chatSocket}/>
        <Route exact path="/not-found" component={NotFound} />
      </Switch>
    </div>
  )
}
export default App;
