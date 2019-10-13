import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getProfileByHandle } from "../../actions/profileActions";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import { inspect } from 'util'
import Spinner from "../common/Spinner";
import Axios from "axios";

class Profile extends Component {
  state = {
    friend: null
  }
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile === null && this.props.profile.loading) {
      this.props.history.push("/not-found");
    }
    if (nextProps.profile.profile) {
      Axios.get(`/api/friends/getFriend/${nextProps.profile.profile._id}`)
        .then((res) => {
          this.setState({ friend: res.data })
        })
    }
  }

  FriendButton = () => {
    console.log(`friend: ${JSON.stringify(this.state)}`)
    const friend = this.state.friend
    if (friend == null || friend == "self") {
      return (null)
    }
    if (friend.status == "approved") return (<i className="material-icons right">people</i>)
    if (friend.status == "pending") {
      if (friend.request == true) {
        return (<div><button className="btn btn-large waves-effect waves-light hoverable green accent-3" onClick={this.acceptFriendRequest} value={true}>Accept</button>
          <button className="btn btn-large waves-effect waves-light hoverable green accent-3" onClick={this.acceptFriendRequest} value={false} >Reject</button></div>)
      }
      return (<i className="material-icons right">access_time</i>)
    }
    else return (
      <button className="btn btn-large waves-effect waves-light hoverable green accent-3" onClick={this.sendFriendRequest}>Send Friend Request</button>
    )
  }


  sendFriendRequest = () => {
    Axios.get(`/api/friends/sendFriendRequest/${this.props.profile.profile._id}`)
      .then((res) => {
        this.setState({ friend: res.data.friend })
      })
  }
  acceptFriendRequest = (e) => {
    console.log(`accept friend request: ${inspect(e.target.value)}`)
    Axios.post('/api/friends/acceptOrRejectFriendRequest',{
      friendDocId:this.state.friend._id,
      accept:e.target.value
    })
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div>
          <div className="row">
            <div className="col s6">
              <Link
                to="/dashboard"
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
              >
                Back to Dashboard
              </Link>
            </div>
            <div className="col s1 offset-s4" >
              <this.FriendButton />
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

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileByHandle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(Profile);
