import Axios from 'axios';
import React, { Component } from 'react';

class FriendButton extends Component {
    state = {
        friend: null
      }
    componentDidMount(){
        Axios.get(`/api/friends/getFriend/${this.props.profileId}`)
        .then((res) => {
          this.setState({ friend: res.data })
        })
    }
    sendFriendRequest = () => {
        Axios.get(`/api/friends/sendFriendRequest/${this.props.profileId}`)
            .then((res) => {
                this.setState({ friend: res.data.friend })
            })
    }
    acceptFriendRequest = (e) => {
        Axios.post('/api/friends/acceptOrRejectFriendRequest', {
            friendDocId: this.state.friend._id,
            accept: e.target.value
        }).then((res)=>{
            if(this.props.cb){
                this.props.cb()
            }
        })
    }
    removeFriend=(e)=>{
        Axios.post('/api/friends/removeFriend',{
            friendDocId: this.state.friend._id,
        }).then((res)=>{
            if(this.props.cb){
                this.props.cb()
            }
        })
    }
    render() {
        const friend = this.state.friend
        if (friend===null || friend === "self") {
            return (null)
        }
        if (friend.status === "approved") return (<div><i className="material-icons right">people</i><button className="btn btn-large waves-effect waves-light hoverable green accent-3" onClick={this.removeFriend}>Remove</button></div>)
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

export default FriendButton