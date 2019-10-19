import moment from 'moment'; //npm install moment --save (CLIENT)
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { deleteUser, logoutUser } from "../../actions/authActions";
import { deleteAccount, getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
//test
import NavBar from './NavBar';
import ProfileActions from './ProfileActions';



const options = [
  'EDIT PROFILE',
  'DELETE',
  'CALENDER',
  'LOG OUT',
];
class Dashboard extends Component {

  onLogoutClick = e => {
    alert("test logout");
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
 //test
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
        <NavBar/>
        <div style={{ height: "75vh" }} className="container">
          <div className="row">
            <div className="col s12 center-align ">

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
              {/* <Link to="/groups" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem",
                  marginBottom: "1.4rem",
                }}>
                Groups
              </Link> */}

              {/* <Link to="/forum" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem",
                  marginBottom: "1.4rem",
                  marginLeft: 16,
                }}>
                FORUM
              </Link>

              <Link to="/profilelist" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
              </Link>  */}
              <Link to="/calendar" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{

                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem",
                  marginBottom: "1.4rem",
                  marginLeft: 16,
                }}>
                View Calendar
              </Link>
              </div>

              <Link to="/profilelist" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{

                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem",
                  marginBottom: "1.4rem",
                  marginLeft: 16,
                }}>
                View Users
              </Link>


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
