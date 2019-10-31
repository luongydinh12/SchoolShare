import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner"
import CreateChat from './CreateChat'
import FriendsList from '../profile/FriendsList';

class PrivateChat extends Component {
    state = {
        chats: null,
        displayedChats: null,
        loaded: false
    }
    componentDidMount = () => {
        // Axios.get('/api/groups/getmygroups?user=' + this.props.auth.user.id)
        //     .then(result => {
        //         this.setState({ chats: result.data.data, displayedChats: result.data.data, loaded: true })
        //     })
        Axios.get('/api/groupchat/getChats')
            .then((result) => {
                this.setState({ chats: result.data, displayedChats: result.data, loaded: true })
            }).catch((err) => {
                console.log(err)
            })
    }
    SearchBar = () => {
        if (this.state.chats) return (
            <div className="search">
                <input id="search" placeholder="Search" autoComplete="off"
                    onChange={this.handleSearch}
                    required type="text" />
            </div>
        )
        return null
    }
    handleSearch = () => {
        const query = document.querySelector('#search').value
        const { chats } = this.state
        console.log(`handle search query: ${query}`)
        const c = (query === null) ? chats : chats.filter((cur) => {
            if (cur.name.toUpperCase().includes(query.toUpperCase())) return cur
        })
        this.setState({ displayedChats: c })
    }
    ChatList = () => {
        const { displayedChats } = this.state
        const list = displayedChats ? displayedChats.map((c) => {
            return (
                <Fragment key={c._id}>
                    <li className="collection-item avatar">
                        <Link to={'/groups/chat/' + c._id}                    >
                            <span className="title">{c.name}</span>
                        </Link>
                        <p>{c.desc}</p>
                        <p>Members: {c.owner.handle}{c.members.map((m) =>
                            `, ${m.handle}`
                        )}</p>
                    </li>
                </Fragment>
            )
        })
            : null
        return (<ul className="collection">{list}</ul>)
    }
    render() {

        const content = (this.state.loaded) ?
            <div>
                <this.SearchBar />
                <this.ChatList />
            </div> : <Spinner />
        return (
            <div className="container" style={{ marginBottom: "20px" }}>
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text"
                    >Chats</h4>
                    {content}
                    <CreateChat />        
                </div>
            </div>
        )
    }
}

export default connect((state) => ({ auth: state.auth }))(PrivateChat)