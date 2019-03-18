import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, deleteUser } from "../../actions/authActions";
import moment from 'moment'; //npm install moment --save (CLIENT)

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
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div>
        <div style={{
          cssFloat: "left", display: "flex",
          flexDirection: "column"
        }}>
          <aside id="groupList" style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "gray",
            height: "100vh",
            width: "200px"
          }}>
            <img id="groupIcon" src="" alt="A" />
            <img id="groupIcon" src="" alt="B" />
            <img id="groupIcon" src="" alt="C" />
            <img id="groupIcon" src="" alt="D" />
          </aside>

        </div>


        <div className="container valign-wrapper">
        <div className="col s12 center-align">
        <h1 style={{ fontFamily: "Urbana" }}>Welcome to School Share 🎉</h1> 

          <img id="userAvatar" style={{
            verticalAlign: "middle",
            borderRadius: "50%",
            width: "150px",
            height: "150px",
            textAlign: "center",
            marginTop: "25px"
          }} src={user.avatar} />

          <p class="userName" style={{
            fontWeight: "bold",
            fontSize: "250%"
          }}>{user.name}</p>

          <p class="userEmail" style={{
            // fontWeight: "bold",
            fontSize: "150%"
          }}>Email: {user.email}</p>

          <p class="userDate" style={{
            // fontWeight: "bold",
            fontSize: "150%"
          }}>Joined Date: {moment(user.date).format('MM/DD/YYYY')}</p>
          <p class="userDesc" style={{
            // fontWeight: "bold",
            fontSize: "150%"
          }}>Bio: {user.description}</p>
          <p> </p>
          <button
            style={{
              width: "150px",
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
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "2rem",
              marginLeft: "1rem"
            }}
            //onClick={this.onProfileClick}
            className="btn btn-large waves-effect waves-light hoverable green accent-3"
          >
            Edit Profile
            </button>

          <button
            style={{
              width: "150px",
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
  deleteUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser, deleteUser }
)(Dashboard);
