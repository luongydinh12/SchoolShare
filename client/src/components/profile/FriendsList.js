import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import FriendButton from './FriendButton'
import Spinner from "../common/Spinner"
class FriendsList extends Component {
    state = {
        friends: null,
        displayedFriends: null,
    }
    componentDidMount = () => {
        this.getFriendsList()
    }

    getFriendsList = () => {
        Axios.get('/api/friends/listFriends')
            .then((res) => {
                this.setState({ friends: res.data, displayedFriends: res.data })
            })
    }

    friendButtonCb = () => {
        this.getFriendsList()
    }

    handleSearch = () => {
        const query = document.querySelector('#search').value
        const friends = this.state.friends
        const f = (query === null) ? friends : friends.filter((cur) => {
            if (cur.friend.handle.toUpperCase().includes(query.toUpperCase())) return cur
        })
        this.setState({ displayedFriends: f })
    }

    render() {
        const { displayedFriends } = this.state
        if (displayedFriends) { //if friends list has been retrieved
            const list = displayedFriends.map((f) => {
                return (<ProfileListItemFragment {...f} key={f.friend._id} cb={this.friendButtonCb} />)
            })

            return (<div className="container" style={{ marginBottom: "20px" }}>
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text"
                    >Friends List</h4>
                    <div className="search">
                        <input id="search" placeholder="Search" autocomplete="off"
                            onChange={this.handleSearch}
                            required type="text" />
                    </div>
                    <ul className="collection">
                        {list}
                    </ul>
                </div>
            </div>)
        }
        return (<Spinner />)
    }
}

class ProfileListItemFragment extends Component {
    render() {
        const friend = this.props.friend
        const dontShowFriendButton = this.props.dontShowFriendButton
        return (
            <Fragment >
                <div className="row">
                    <div className="col s10">
                        <li className="collection-item avatar">
                            <img src={friend.avatar} alt="" className="circle" />
                            <Link to={'/profile/' + friend.handle}                    >
                                <span className="title">{friend.handle}</span>                </Link>
                            <p>{friend.description}
                            </p>
                        </li>
                    </div>
                    {(dontShowFriendButton) ? null : <div className="col s2"><FriendButton profileId={friend._id} cb={this.props.cb} />     </div>}
                </div>
            </Fragment>
        )
    }
}
export default FriendsList
export { ProfileListItemFragment }