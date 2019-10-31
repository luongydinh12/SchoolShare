import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner"
import CreateChat from './CreateChat'
import FriendsList from '../profile/FriendsList';

class ChatList extends Component {
    state = {
        chats: null,
        displayedChats: null,
        loaded: false
    }
    componentDidMount = () => {
        this.getChats()
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.profile.loading) {
            console.log(`PROFILE LOADED: ${JSON.stringify(this.props.profile)}`)
            this.setState({ loaded: this.checkLoaded() })
        }
    }
    getChats = () => {
        Axios.get('/api/groupchat/getChats')
            .then((result) => {
                this.setState({ chats: result.data, displayedChats: result.data })
                this.setState({ loaded: this.checkLoaded() })
            }).catch((err) => {
                console.log(err)
            })
    }
    checkLoaded = () => {
        console.log('checkLoaded')
        console.log(this.props.profile.profile)
        console.log(this.state.chats)
        return (this.props.profile.profile && this.state.chats)
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
    leaveOrDeleteChat = (e) => {
        const chatId = e.target.getAttribute('value') //materialize-css marks the i element as target if you click on the icon itself rather than the surrounding button and e.target.value doesn't work
        const chat = this.state.chats.find((chat) => {
            return chat._id === chatId
        })
        if (chat.owner._id === this.props.profile.profile._id) {
            if (!window.confirm('Do you really want to delete this chat?')) {
                return
            }
        }
        Axios.post('/api/groupchat/leaveordelete', {
            chat: chatId,
            profileId: this.props.profile.profile._id
        }).then((res) => {
            console.log(res)
            this.getChats()
        })
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
        console.log(`displayedChats: ${displayedChats}`)
        const profileId = this.props.profile.profile._id
        const list = displayedChats ? displayedChats.map((c) => {
            return (
                <Fragment key={c._id} >
                    <li className="collection-item avatar row">
                        <div className='col s10'>
                            <Link to={'/private-chat/' + c._id}                    >
                                <span className="title">{c.name}</span>
                            </Link>
                            <p>{c.desc}</p>
                            <p>Members: {c.owner.handle}{c.members.map((m) =>
                                `, ${m.handle}`
                            )}</p>
                        </div>

                        <div className='col s2'>
                            <button className="waves-effect waves-light btn" onClick={this.leaveOrDeleteChat} value={c._id} >
                                <i className="material-icons" value={c._id}>
                                    {(c.owner._id === profileId) ? "delete" : "cancel"}
                                </i>
                            </button>
                        </div>
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
                <this.ChatList profileId={this.props.profile.profile._id} />
            </div> : <Spinner />
        return (
            <div className="container" style={{ marginBottom: "20px" }}>
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text"
                    >Chats</h4>
                    {content}
                    <CreateChat cb={this.getChats} />
                </div>
            </div>
        )
    }
}

export default connect((state) => ({ auth: state.auth, profile: state.profile }))(ChatList)