import React, { Component } from "react";
//import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import OAuth from "./components/auth/OAuth";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";

//import { clearCurrentProfile } from "./actions/profileActions";
import CreateProfile from "./components/profile/CreateProfile";
import EditProfile from "./components/profile/EditProfile";
import Profile from "./components/profile/Profile";
import ProfilesList from "./components/profile/ProfilesList"
import FriendsList from './components/profile/FriendsList'
import NotFound from "./components/not-found/NotFound";

import Groups from "./components/Groups/Groups";
import MyGroups from "./components/Groups/MyGroups";
import CreateCategory from "./components/Groups/CreateCategory";
import Forum from "./components/forum/Forum";

// import io from 'socket.io-client'
// const keys = require("../package.json");
// const socket=io("https://localhost:5050")
// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
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
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/oauth" component={OAuth} />
            <Route path="/forum" component={Forum} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Route exact path="/profilelist" component={ProfilesList} />
            <Route exact path="/friendslist" component={FriendsList} />
            <Route path="/groups" component={Groups} />
            <Route path="/mygroups" component={MyGroups} />
            <Route path="/create-category" exact component={CreateCategory} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>

            <Switch>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
            </Switch>

            <Route exact path="/not-found" component={NotFound} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
