import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import isEmpty from '../../validation/is-empty';
import DefaultImg from '../../icons/DefaultImage/default-img.jpg';
import axios from 'axios';
import '../../App.css';
const API_URL = "http://localhost:5000";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: '',
      description: '',
      avatar: '', 
      name: '',
      //email: '',
      errors: {},
      multerImage: DefaultImg,
      baseImage: DefaultImg,
    };
  }

  setDefaultImage(uploadType) {
    if (uploadType === "multer") {
      this.setState({
        multerImage: DefaultImg
      });
    } /*else if (uploadType === "firebase") {
      this.setState({
        firebaseImage: DefaultImg
      });
    }*/ else {
      this.setState({
        baseImage: DefaultImg
      });
    }
  }

  uploadImage(e, method) {
    let imageObj = {};

    if (method === "multer") {

      let imageFormObj = new FormData();
      const userId = this.props.auth.user.id;
      console.log(userId);
      imageFormObj.append("imageName", "multer-image-" + Date.now());
      imageFormObj.append("imageData", e.target.files[0]);
      imageFormObj.append("userId", userId);
      // stores a readable instance of 
      // the image being uploaded using multer
      this.setState({
        multerImage: URL.createObjectURL(e.target.files[0])
      });

     //axios.post(`${API_URL}/image/uploadmulter`, imageFormObj)
     axios.post(`/image/uploadmulter`, imageFormObj)
        .then((data) => {
          if (data.data.success) {
            alert("Image has been successfully uploaded using multer");
            this.setDefaultImage("multer");
          }
        })
        .catch((err) => {
          alert("Error while uploading image using multer");
          this.setDefaultImage("multer");
        });
    }
  }
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;


      profile.description = !isEmpty(profile.description) ? profile.description : '';

      this.setState({
        handle: profile.handle,
        description: profile.description,
        avatar: profile.user.avatar,
        name: profile.user.name,
        //email: profile.user.email,
      });
    }
  }

  onSubmit=(e)=> {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      description: this.state.description,
      avatar: this.state.avatar,
      name: this.state.name,
      //email: this.state.email,

    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange=(e) =>{
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link
                to="/dashboard"
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
              >
                Go Back
              </Link>
              <h1 className="display-4 text-center">Edit Profile</h1>
              
              <div className="image-container">
                <div className="process">
                  <p className="process__details">Upload your profile image</p>

                  <input
                    type="file"
                    className="process__upload-btn"
                    onChange={e => this.uploadImage(e, "multer")}
                  />
                  <img
                    src={this.state.multerImage}
                    alt="upload-image"
                    className="process__image"
                  />
                </div>{" "}
              </div>
              <form onSubmit={this.onSubmit}>
                <p>Please type in </p>
                <small className="d-block pb-3">* = required fields</small>
                <TextFieldGroup
                  placeholder="Your Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  info="Your Name"
                />
                {/*                 <TextFieldGroup
                  placeholder="* Your Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="Your Email"
                /> */}
                <TextFieldGroup
                  placeholder="* Profile Username"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="A unique Username for your profile URL."
                />
                <TextFieldGroup
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Tell me about yourself"
                />
                {/* <TextFieldGroup
                  placeholder="Avatar"
                  name="avatar"
                  value={this.state.avatar}
                  onChange={this.onChange}
                  error={errors.avatar}
                  info="Avatar URL"
                /> */}

                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-large waves-effect waves-light hoverable green accent-3"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(CreateProfile)
);
