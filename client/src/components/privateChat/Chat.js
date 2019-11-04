import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import Spinner from "../common/Spinner"

// import io from 'socket.io-client'
// const socket = io("http://localhost:5050/")
class Chat extends Component {
    state = {
        chat: null,
        messages: null,
        messageInput: ''
    }
    componentDidMount() {
        this.getChat()
        const socket = this.props.socket
        socket.on('*', (event, data) => {
            console.log(event)
            console.log(data)
        })
        socket.on('chatmsg', (res) => {
            console.log(`chatResponse: ${JSON.stringify(res)}`)
            this.setState({ messages: [...this.state.messages, res] })
        })
    }
    componentDidUpdate=()=>{
        this._scrollMessages()
    }
    getChat = () => {
        const chatId = this.props.location.pathname.split('/')[2]
        Axios.get(`/api/groupchat/chat/${chatId}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ chat: res.data.chat, messages: res.data.messages })
                this.props.socket.emit('join', this.state.chat._id)
            }).catch((err) => {
                console.log(err)
                this.props.history.push('/private-chat')
            })
    }
    // sendSocketIO = (msg) => {
    //     socket.emit(msg.name, msg.data);
    //     this.receiveSocketIo();
    // }
    MemberList = () => {
        const members = [this.state.chat.owner, ...this.state.chat.members]
        return (<ul>
            {members.map((m) => {
                return <li key={m._id}>{m.handle}</li>
            })}
        </ul>)
    }
    MessageList = () => {
        return (
            <ul id='messages' style={{
                height: '16rem',
                overflowY: "scroll"
            }}>
                {this.state.messages.map((msg, i) => {
                    const posterStyle = (msg.poster._id === this.props.profile.profile._id) ? 'offset-s3 green lighten-5' : 'pink lighten-5'
                    {
                        return (
                            <li className={`row card-panel col s9 ${posterStyle}`} style={{ padding: 5 }} key={i}>
                                <p>{msg.text}</p>
                                <p style={{ fontSize: 10 }}>{msg.poster.handle}</p>
                            </li>
                        )
                    }
                })}
            </ul>
        )
    }
    _handleMessageChange = (e) => {
        this.setState({ messageInput: e.target.value })
    }
    _handleMessageKeyUp = (e) => {
        if (e.which === 13) {//enter
            e.preventDefault()
            const socket = this.props.socket
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
            this.setState({messageInput:''})
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
                <div className="container">
                    <div className="card white" >
                        <div className='container'>
                            <h4 className='title'>{chat.name}</h4>
                            <div className="row" >
                                <div className="col s9">
                                    {/* <ul id='messages' style={{
                                        minHeight: '300px',
                                        overflowY: "scroll"
                                    }}>
                                        <li className="row card col s9 darken-2" style={{ padding: 5 }}>
                                            <p>msg</p>
                                            <p style={{ fontSize: 10 }}>created by adsf asdfaf</p>
                                        </li>
                                    </ul> */}
                                    <this.MessageList />
                                    <input id="messageInput" placeholder="Message" autoComplete="off"
                                        onChange={this._handleMessageChange}
                                        onKeyUp={this._handleMessageKeyUp}
                                        value={this.state.messageInput}
                                        required type="text" />
                                </div>
                                <div className="col s3">
                                    <h6>Members</h6>
                                    <hr />
                                    <this.MemberList />
                                </div>
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