import Axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class FriendButton extends Component {
    state = {
        friend: null
      }
    componentDidMount(){
        console.log(`profid: ${this.props.profile.profile._id}`)
        Axios.get(`/api/friends/getFriend/${this.props.profile.profile._id}`)
        .then((res) => {
          this.setState({ friend: res.data })
        })
    }
    sendFriendRequest = () => {
        Axios.get(`/api/friends/sendFriendRequest/${this.props.profile.profile._id}`)
            .then((res) => {
                this.setState({ friend: res.data.friend })
            })
    }
    acceptFriendRequest = (e) => {
        Axios.post('/api/friends/acceptOrRejectFriendRequest', {
            friendDocId: this.state.friend._id,
            accept: e.target.value
        })
    }
    render() {
        const friend = this.state.friend
        if (friend===null || friend === "self") {
            return (null)
        }
        if (friend.status === "approved") return (<i className="material-icons right">people</i>)
        if (friend.status === "pending") {
            if (friend.request === true) {
                return (<div><button className="btn btn-large waves-effect waves-light hoverable green accent-3" onClick={this.acceptFriendRequest} value={true}>Accept</button>
                    <button className="btn btn-large waves-effect waves-light hoverable green accent-3" onClick={this.acceptFriendRequest} value={false} >Reject</button></div>)
            }
            return (<i className="material-icons right">access_time</i>)
        }
        else return (
            <button className="btn btn-large waves-effect waves-light hoverable green accent-3" onClick={this.sendFriendRequest}>Send Friend Request</button>
        )
    }
}
const mapStateToProps = state => ({
    profile: state.profile
  })
export default connect(mapStateToProps)(FriendButton)