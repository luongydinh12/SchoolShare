import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, deleteUser } from "../../actions/authActions";
import moment from 'moment'; //npm install moment --save (CLIENT)


import { Link } from 'react-router-dom'
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions'
import Spinner from '../common/Spinner'
import ProfileActions from './ProfileActions'
import GroupActions from './GroupActions'

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  onDeleteClick = e => {
    if (window.confirm("Do you want to delete your account?")) {
      e.preventDefault();
      this.props.deleteUser();
    }
  }

  componentDidMount() {
    document.body.classList.add("background-white");
    this.props.getCurrentProfile()
  }

  handleDeleteAccount = () => {
    this.props.deleteAccount()
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile
    let dashboardContent
    if (profile === null || loading) {
      dashboardContent = <Spinner />
      // Check if user has profile
    } else if (Object.keys(profile).length > 0) {
      dashboardContent = (
        <div>
          <p style={{
            // fontWeight: "bold",
            fontSize: "150%"
          }} className="lead text-muted">
            <Link to={`/profile/${profile.handle}`}>My Profile Page</Link>
          </p>
          <ProfileActions />
          <div style={{ marginBottom: '15px' }} />
          {/*           <button  style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "2rem"
            }}  className="btn btn-large waves-effect waves-light hoverable green accent-3" onClick={this.handleDeleteAccount}>
            Delete account
          </button> */}
        </div>
      )
    } else {
      // User has no profile
      dashboardContent = (
        <div>
          {/* <p className="lead text-muted">Welcome {user.name}</p> */}
          <p style={{
            // fontWeight: "bold",
            fontSize: "150%"
          }}>You have no profile page. Create now.</p>
          <Link to="/create-profile" className="btn btn-large waves-effect waves-light hoverable green accent-3">
            Create profile
          </Link>
        </div>
      )
    }

    return (
      <div>
        <div style={{ height: "75vh" }} className="container valign-wrapper">
          <div className="row">
            <div className="col s12 center-align ">
              <h1 style={{ fontFamily: "Urbana" }}>Welcome to School Share 🎉</h1>

              <img id="userAvatar" style={{
                verticalAlign: "middle",
                borderRadius: "50%",
                width: "150px",
                height: "150px",
                textAlign: "center",
                marginTop: "25px"
              }} src={user.avatar} />

              <p className="userName" style={{
                fontWeight: "bold",
                fontSize: "250%"
              }}>{user.name}</p>

              <p className="userEmail" style={{
                // fontWeight: "bold",
                fontSize: "150%"
              }}>Email: {user.email}</p>

              <p className="userDate" style={{
                // fontWeight: "bold",
                fontSize: "150%"
              }}>Joined Date: {moment(user.date).format('MM/DD/YYYY')}</p>

              {dashboardContent}

              <div>
              <Link to="/groups" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem",
                  marginBottom: "1.4rem",
                }}>
                Groups
              </Link>

{/*               <Link to="/forum" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem",
                  marginBottom: "1.4rem",
                  marginLeft: 16,
                }}>
                FORUM
              </Link> */}</div>

              <button
                style={{
                  width: "200px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem"
                }}
                onClick={this.onLogoutClick}
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
              >
                Logout
            </button>

              <button
                style={{
                  width: "200px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem",
                  marginLeft: "1rem"
                }}
                onClick={this.onDeleteClick}
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
              >
                Delete Account
            </button>
            </div>
          </div>
        </div>

        {/* 
        <div style={{ height: "75vh" }} className="container valign-wrapper">
          <div className="row">
            <div className="col s12 center-align">
              <h4>
                <b>Hey there,</b> {user.name.split(" ")[0]}
                <p className="flow-text grey-text text-darken-3">
                  This is your user profile. Updates are coming soon! </p>
                <p className="flow-text grey-text text-darken-3"> {" "}
                  <span style={{ fontFamily: "Urbana" }}>Welcome to School Share</span> 🎉
              </p>
              </h4>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, logoutUser, deleteUser }
)(Dashboard);
