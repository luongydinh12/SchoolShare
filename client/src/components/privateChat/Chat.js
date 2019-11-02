import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import Spinner from "../common/Spinner"

import io from 'socket.io-client'
const socket = io("http://localhost:5050/")
class Chat extends Component {
    state = {
        chat: null
    }
    componentDidMount() {
        this.getChat()
    }
    getChat = () => {
        const chatId = this.props.location.pathname.split('/')[2]
        Axios.get(`/api/groupchat/chat/${chatId}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ chat: res.data })
            }).catch((err) => {
                this.props.history.push('/private-chat')
            })
    }
    sendSocketIO = (msg) => {
        socket.emit(msg.name, msg.data);
        this.receiveSocketIo();
    }
    MemberList = () => {
        const members = [this.state.chat.owner, ...this.state.chat.members]
        return (<ul>
            {members.map((m) => {
                return <li key={m._id}>{m.handle}</li>
            })}
        </ul>)
    }
    _handleMessageChange = (e) => {
        this.setState({ message: e.target.value })
    }
    render() {
        const chat = this.state.chat
        if (chat) {
            return (
                <div className="container">
                    <div className="card white">
                        <div className='container'>
                            <h4 className='title'>{chat.name}</h4>
                            <div className="row">
                                <div className="col s9">
                                    {/* {messageList} */}
                                    <input id="message" placeholder="Message" autoComplete="off"
                                        onChange={this._handleMessage}
                                        required type="text" />
                                </div>
                                <div className="col">
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

export default connect((state) => ({ auth: state.auth, profile: state.profile }))(Chat)