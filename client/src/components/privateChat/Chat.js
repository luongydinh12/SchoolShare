import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import Spinner from "../common/Spinner"

import io from 'socket.io-client'
const socket = io("http://localhost:5050/")
class Chat extends Component {
    state = {
        chatId: null,
        chat: null
    }
    componentDidMount() {
        this.getChat()
    }
    getChat = () => {
        const chatId = this.props.location.pathname.split('/')[2]
        this.setState({ chatId: chatId })
        Axios.get(`/api/groupchat/chat/${chatId}`)
            .then((res) => {
                this.setState({ chat: res.data })
            }).catch((err) => {
                this.props.history.push('/private-chat')
            })
    }
    sendSocketIO = (msg) => {
        socket.emit(msg.name, msg.data);
        this.receiveSocketIo();
    }
    render() {
        let messageList = <Spinner />
        let membersList = <Spinner />
        let joinButton = null, leaveButton = null, leaveModal = null, editDelete = null;
        let messageForm = null;
        const { messages, error, members } = this.state;

        return (
            <div className="container">
                <div className="card white custom-modal-btn" style={{ padding: 5 }}>

                    <button onClick={this.props.history.goBack} className="btn btn-large waves-effect waves-light hoverable green accent-3"
                        style={{
                            marginLeft: "25px",
                            marginTop: "3rem",
                            width: "150px"
                        }}>Return</button>
                    {joinButton}
                    {leaveModal}
                    <h4 className="center-text"
                        style={{
                            fontFamily: "Urbana",
                            marginLeft: "23px"
                        }}>Group Messages</h4>
                    <div className="row">
                        <div className="col l9">
                            {messageList}
                            <div style={{}} className="col l11">
                                {messageForm}
                            </div>
                        </div>
                        <div className="col l3">
                            <h6 style={{ fontFamily: "Urbana", fontSize: "20px" }}>Members</h6>
                            <hr />
                            {membersList}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        let messageList = <Spinner />
        let membersList = <Spinner />
        let joinButton = null, leaveButton = null, leaveModal = null, editDelete = null;
        let messageForm = null;
        const { messages, error, members } = this.state;

        if (error) {
            messageList = <h4>an error occured...</h4>
        }
        return (
            <div className="container">
                <div className="card white custom-modal-btn" style={{ padding: 5 }}>

                    <button onClick={this.props.history.goBack} className="btn btn-large waves-effect waves-light hoverable green accent-3"
                        style={{
                            marginLeft: "25px",
                            marginTop: "3rem",
                            width: "150px"
                        }}>Return</button>
                    {joinButton}
                    {leaveModal}
                    <h4 className="center-text"
                        style={{
                            fontFamily: "Urbana",
                            marginLeft: "23px"
                        }}>Group Messages</h4>
                    <div className="row">
                        <div className="col l9">
                            {messageList}
                            <div style={{}} className="col l11">
                                {messageForm}
                            </div>
                        </div>
                        <div className="col l3">
                            <h6 style={{ fontFamily: "Urbana", fontSize: "20px" }}>Members</h6>
                            <hr />
                            {membersList}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect((state) => ({ auth: state.auth, profile: state.profile }))(Chat)