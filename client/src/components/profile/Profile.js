import Axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import FriendButton from './FriendButton';
import ProfileAbout from "./ProfileAbout";
import ProfileHeader from "./ProfileHeader";
class Profile extends Component {
  state={
    profile:null
  }
  componentDidMount() {

    const handle=this.props.location.pathname.split('/')[2]
    console.log(handle)
    Axios.get(`/api/profile/handle/${handle}`).then((res)=>{
      console.log(res.data)
      this.setState({profile:res.data})
    }).catch((err)=>{
      console.log(err)
      this.props.history.push("/not-found")
    })
  }

  FriendButton = () => {
    if (this.state.profile._id) {
      return <FriendButton profileId={this.state.profile._id} />
    }
  }

  render() {
    const profile=this.state.profile
    let profileContent;

    if (profile === null) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div>
          <div className="row">
            <div className="">
            <a
                href="/"
                onClick={e => {
                  e.preventDefault();
                  this.props.history.goBack();
                }}
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
                style={{
                  width: "160px",
                  borderRadius: "1px",
                  marginRight: "2rem"
                }}
              >
                Go Back
              </a>
              <span ><this.FriendButton /></span>
            </div>
          </div>
          <ProfileHeader profile={profile} />
          <ProfileAbout profile={profile} />
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{profileContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile