import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import FriendButton from './FriendButton'
import Spinner from "../common/Spinner"
class FriendsList extends Component {
    state = {
        friends: null,
        filteredFriends: null
    }
    componentDidMount = () => {
        this.getFriendsList()
    }

    getFriendsList = () => {
        Axios.get('/api/friends/listFriends')
            .then((res) => {
                this.setState({ friends: res.data })
                this.search(document.querySelector('#search').value)
            })
    }

    friendButtonCb = () => {
        this.getFriendsList()
    }

    FriendSearch = () => {
        return (
            <div className="search">
                <input id="search" placeholder="Search"
                    onChange={this.handleSearch}
                    required type="text" />
            </div>)
    }

    handleSearch = (e) => {
        this.search(e.target.value)
    }

    search = (query) => {
        if (query === null) return this.setState({ filteredFriends: null })
        const friends = this.state.friends
        const f = friends.filter((cur) => {
            if (cur.friend.handle.includes(query)) return cur
        })
        this.setState({ filteredFriends: f })
    }

    render() {
        const { friends, filteredFriends } = this.state
        if (friends) { //if friends list has been retrieved
            const fr = filteredFriends ? filteredFriends : friends
            const list = fr.map((f) => {
                return (<ProfileListItemFragment {...f} key={f.friend._id} cb={this.friendButtonCb} />)
            })

            return (<div className="container" style={{ marginBottom: "20px" }}>
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text"
                    >Friends List</h4>
                    <this.FriendSearch />
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
                    <div className="col s2">
                        <FriendButton profileId={friend._id} cb={this.props.cb} />
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default FriendsList