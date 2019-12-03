import moment from 'moment'; //npm install moment --save (CLIENT)
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { deleteUser, logoutUser } from "../../actions/authActions";
import { deleteAccount, getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import Axios from "axios";
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
} from './components';

class Dashboard extends Component {
  
  state = {
    avatar: null
  }
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
    Axios.get("api/users/avatar?user=" + this.props.auth.user.id).then((res) => {
      console.log(res.data.avatar)
      this.setState({ avatar: res.data.avatar })
    })
  }
  //test
  handleDeleteAccount = () => {
    this.props.deleteAccount()
  }
  render() {
    const useStyles = makeStyles(theme => ({
      root: {
        padding: theme.spacing(4)
      }
    }));
    
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
    
          <Link to="/edit-profile" >
            <button className="btn btn-large waves-effect waves-light hoverable green accent-3" > Edit Profile </button>
          </Link>
          <div style={{ marginBottom: '15px' }} />
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
        <div className="section">
          <div className="row">
            <div className="col s12 center-align ">

              <img id="userAvatar"
                alt=""
                style={{
                  verticalAlign: "middle",
                  borderRadius: "50%",
                  width: "150px",
                  height: "150px",
                  textAlign: "center",
                  marginTop: "25px"
                }} src={this.state.avatar} />


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

              {/* <div>

                <Link to="/calendar">
                  <button className="btn btn-large waves-effect waves-light hoverable green accent-3">
                    View Calendar
                  </button>
                </Link>

              </div> */}
              
              <div className='section'>
                {/* <Link to="/profilelist">
                  <button className="btn btn-large waves-effect waves-light hoverable green accent-3">
                    View Users
                </button>
                </Link> */}


                {/* <button
                  onClick={this.onLogoutClick}
                  className="btn btn-large waves-effect waves-light hoverable green accent-3"
                >
                  Logout
            </button> */}

                {/* <button
                  onClick={this.onDeleteClick}
                  className="btn btn-large waves-effect waves-light hoverable green accent-3">
                  Delete Account
            </button> */}

              </div>
            </div>
          </div>
        </div>
        <div className='sectoion2'>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Budget />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalUsers />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TasksProgress />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalProfit />
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <LatestSales />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          <UsersByDevice />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
 
        </Grid>
        
      </Grid>
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
