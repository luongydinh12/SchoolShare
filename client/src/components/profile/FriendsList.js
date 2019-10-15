import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import FriendButton from './FriendButton'

class FriendsList extends Component {
    state = {
        friends: null
    }
    componentDidMount = () => {
        Axios.get('/api/friends/listFriends')
            .then((res) => {
                this.setState({ friends: res.data })
            })
    }
    render() {
        const friends = this.state.friends
        if (friends) {
            const list = friends.map((f) => {
                return (<ProfileListItemFragment {...f} key={f.friend._id} />)
            })

            return (<div className="container" style={{ marginBottom: "20px" }}>
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text"
                    >List of Friends</h4>
                    <ul className="collection">
                        {list}
                    </ul>
                </div>
            </div>)
        }
        return (<div>Error</div>)
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
                        <FriendButton profileId={friend._id} />
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default FriendsList