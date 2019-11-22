import moment from 'moment'; //npm install moment --save (CLIENT)
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { deleteUser, logoutUser } from "../../actions/authActions";
import { deleteAccount, getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import axios from 'axios';
import DefaultImg from '../../image/avatar_4.png';


class Dashboard extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      multerImage: DefaultImg
    }
  }
  setDefaultImage(uploadType) {
    if (uploadType === "multer") {
      this.setState({
        multerImage: DefaultImg
      });
    }
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

  uploadImage= (e, method)=>{
  //console.log('success');
  let imageObj = {};
  //alert('uploadimage',method)
  //console.log(`uploadImage method=${method}`)

  if (method === "multer") {

    let imageFromObj = new FormData();

    imageFromObj.append("imageName", "multer-image-" + Date.now());
    imageFromObj.append("imageData", e.target.files[0]);
// stores a readable instance of 
// the image  being uploaded using multer
    this.setState({
      multerImage: URL.createObjectURL(e.target.files[0])
    });

   //Axios.post('${API_URL}/image/uploadmulter', imageFromObj)
   axios.post('{api/image/uploadmulter', imageFromObj)
      .then((data) => {
        if (data.data.success) {
          alert("Image has been succesfully uploaded using multer");
        }
      })
      .catch((err) => {
        alert("Error while uploading image using multer");
        this.setDefaultImage("multer");
      });
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
                }} src={user.avatar} />

                <div>
                  {user.avatar}s
                </div>

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
              </div>
              {dashboardContent}
              <div className = "main-container">
               <h3 className = "main-heading"> Image upload App</h3>

               <div className = "main-container">
                 <div className = "process">
                   <h4 className = "process__heading">Process: using Multer</h4>
                   <p className = "process__details" >upload image to a node server, connected to a MongoDB, with the help of multer</p>

                   <input 
                      accept="image/*"
                      type= "file" 
                      className= "peocess__upload-btn tn" 
                      onchange={(e) => this.uploadImage(e,"multer")} 
                   />
                   
                   <img src={this.state.multerImage} 
                   alt= "upload-image" 
                   className="process__image" />
                   </div>
              <div>

                <Link to="/calendar">
                  <button className="btn btn-large waves-effect waves-light hoverable green accent-3">
                    View Calendar
                  </button>
                </Link>

              </div>
              <div className='section'>
                <Link to="/profilelist">
                  <button className="btn btn-large waves-effect waves-light hoverable green accent-3">
                    View Users
                </button>
                </Link>


                <button
                  onClick={this.onLogoutClick}
                  className="btn btn-large waves-effect waves-light hoverable green accent-3"
                >
                  Logout
            </button>

                <button
                  onClick={this.onDeleteClick}
                  className="btn btn-large waves-effect waves-light hoverable green accent-3">
                  Delete Account
            </button>

              </div>
            </div>
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
