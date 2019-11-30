import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import Spinner from "../common/Spinner"
import M from 'materialize-css'
import { ProfileListItemFragment } from '../profile/FriendsList'
import { Link } from 'react-router-dom'
import VoiceChat from './VoiceChat'
import { isAbsolute } from 'path'
class Chat extends Component {
    state = {
        chat: null,
        messages: null,
        messageInput: '',
        friends: null,
        checkedFriends: [],
        onlineList: []
    }
    socket = this.props.io(`http://localhost:5050/chat`)
    componentDidMount() {
        this.getChat()
        const socket = this.socket
        socket.on('chatmsg', (res) => {
            console.log(`chatResponse: ${JSON.stringify(res)}`)
            this.setState({ messages: [...this.state.messages, res] })
        })
        socket.on('onlinelist', (data) => {
            console.log(data)
            this.setState({ onlineList: data })
        })
    }
    componentWillUnmount() {
        //leave room
        this.socket.emit('leave', { prof: this.props.profile.profile._id, room: this.state.chat._id })
    }
    componentDidUpdate = () => {
        this._scrollMessages()
    }
    getChat = () => {
        const chatId = this.props.location.pathname.split('/')[2]
        Axios.get(`/api/groupchat/chat/${chatId}`)
            .then((res) => {
                this.setState({ chat: res.data.chat, messages: res.data.messages })
                this.socket.emit('join', { prof: this.props.profile.profile._id, room: this.state.chat._id })
                if (this.props.profile.profile._id === res.data.chat.owner._id || res.data.chat.membersCanAdd) {
                    return (Axios.get('/api/friends/listFriends'))
                }
            }).then((res) => {
                if (!res) return
                this.setState({
                    friends: res.data.filter((f) => {
                        return f.status === 'approved'
                    })
                })
            })
            .catch((err) => {
                console.log(err)
                this.props.history.push('/private-chat')
            })
    }
    MemberList = () => {
        const members = [this.state.chat.owner, ...this.state.chat.members]
        return (
            <div>
                <ul >
                    <li><h5>Members</h5></li>
                    {members.map((m) => {
                        let style = 'grey-text text-lighten-1'
                        this.state.onlineList.forEach((o) => {
                            if (o === m._id) style = ''
                        })
                        // return <li key={m._id} className={style}>{m.handle}</li>
                        return (
                            <Link to={'/profile/' + m.handle} key={m.handle}>
                                <li className={style}>
                                    {m.handle}
                                </li>
                            </Link>)
                    })}
                </ul>
            </div>

        )
    }
    MessageList = () => {
        if (this.state.messages && this.props.profile) {
            return (
                <ul id='messages' style={{
                    height: '45vh',
                    overflowY: "scroll"
                }}>
                    {this.state.messages.map((msg, i) => {
                        const posterStyle = (msg.poster._id === this.props.profile.profile._id) ? 'offset-s3 green lighten-5' : 'pink lighten-5'

                        return (
                            <li className={`row card-panel col s9 ${posterStyle}`} style={{ padding: 5 }} key={i}>
                                <p>{msg.text}</p>
                                <p style={{ fontSize: 10 }}>{msg.poster.handle}</p>
                            </li>
                        )
                    }
                    )}
                </ul>
            )
        }
        return <Spinner />
    }
    _handleCheckFriend = (e) => {
        const val = e.target.value
        const { checkedFriends } = this.state
        const newCheckedFriends = (e.target.checked) ? [...checkedFriends, e.target.value] : checkedFriends.filter((f) => {
            return (f._id === val)
        })
        this.setState({ checkedFriends: newCheckedFriends })
    }
    _handleAddFriends = e => {
        console.log('handle add friends' + this.state.checkedFriends)
        Axios.post('/api/groupchat/addUsersToChat', { chat: this.state.chat._id, users: this.state.checkedFriends }).then(() => {
            this.getChat()
        })

    }
    AddMemberModal = () => {
        //this.state.friend only has data if the user may add
        if (this.state.friends) {
            const { members } = this.state.chat

            const flist = this.state.friends.filter((f) => {
                for (let m in members) {
                    if (members[m]._id === f.friend._id) return false
                }
                return true
            })

            const list = flist.map((f) => {
                return (<div className='row' key={f.friend._id}>
                    <div className='col s10'>
                        <ProfileListItemFragment {...f} dontShowFriendButton={true} className='col s3' />
                    </div>
                    <label className='col s2'>
                        <input onChange={this._handleCheckFriend} value={f.friend._id} type="checkbox" />
                        <span>Add</span>
                    </label>
                </div>)
            })
            return (
                <div className='container'>
                    <div className="btn-small waves-effect waves-light hoverable" onClick={this.openModal}>
                        Add Members
            </div>
                    <div className='modal'>
                        <div className='modal-content'>
                            <h4>Add Members</h4>
                        </div>
                        <div>
                            <ul className='collection'>
                                {list}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-close waves-effect waves-red btn-flat" onClick={this._handleAddFriends}>Submit</button>
                        </div>
                    </div>
                </div>)
        }
        return null
    }
    openModal = (e) => {
        M.Modal.init(document.querySelector('.modal'), { endingTop: '20%' }).open()
    }
    _handleMessageChange = (e) => {
        this.setState({ messageInput: e.target.value })
    }
    _handleMessageKeyUp = (e) => {
        if (e.which === 13) {//enter
            e.preventDefault()
            const socket = this.socket
            socket.emit('chatmsg',
                {
                    room: this.state.chat._id,
                    msg: {
                        text: this.state.messageInput,
                        poster: {
                            _id: this.props.profile.profile._id,
                            handle: this.props.profile.profile.handle
                        }
                    }
                }
            )
            this.setState({ messageInput: '' })
        }
    }
    _scrollMessages = () => {
        const msgElement = document.querySelector("#messages")
        if (msgElement) {
            msgElement.scrollTop = msgElement.scrollHeight
        }
    }
    render() {
        const chat = this.state.chat
        if (chat) {
            return (
                <div id='chat'>
                    <div className="card white" >
                        <h4 className='title'>{chat.name}</h4>
                        <div className="row" >
                            <div className="col s9">
                                <this.MessageList />
                                <input id="messageInput" placeholder="Message" autoComplete="off"
                                    onChange={this._handleMessageChange}
                                    onKeyUp={this._handleMessageKeyUp}
                                    value={this.state.messageInput}
                                    required type="text" />
                            </div>
                            <div className="col s3">
                                <this.MemberList />
                                <this.AddMemberModal />
                                <VoiceChat
                                    style={{
                                       bottom:'2rem',
                                       position:'absolute'
                                    }}
                                    socket={this.props.io(`http://localhost:5050/voiceChat`)}
                                    profile={this.props.profile}
                                    room={this.state.chat._id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return <Spinner />
    }
}

export default connect((state, ownProps) => ({ auth: state.auth, profile: state.profile, ...ownProps }))(Chat)