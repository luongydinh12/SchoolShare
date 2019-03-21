import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ProfileSideNav from './ProfileSideNav';
import { connect } from 'react-redux';

class GroupChat extends Component {
    state = {
        messages: null,
        loading: true,
        error: false,
        text: ''
    }
    fetchChats = () => {
        const id = this.props.location.pathname.split('/')[3]
        axios.get('/api/posts/getgroup?id=' + id)
            .then(result => {
                this.setState({ messages: result.data.data.messageId, error: false, loading: false })
            })
            .catch(err => {
                this.setState({ error: true, loading: false })
            })
    }
    componentDidMount = () => {
        this.fetchChats()
    }
    createMessage = e => {
        e.preventDefault();
        const id = this.props.location.pathname.split('/')[3]
        const data = {
            text: this.state.text,
            createdByName: this.props.auth.user.name,
            createdBy: this.props.auth.user.id,
            groupId: id,
        }
        axios.post('/api/posts/createmsg', data)
        .then(result => {
            this.fetchChats();
            this.setState({text: ''})
        })
    }

    render() {
        let messageList = <h4>Loading...</h4>
        const { messages, loading, error } = this.state;
        if (messages) {
            messageList = messages.map(message => {
                return (
                    <div key={message._id} className="card white col l11 darken-2" style={{ padding: 5 }}>
                        <p>{message.text}</p>
                        <p style={{ fontSize: 10 }}>{message.createdByName} {message.date.split('T')[0]} {message.date.split('T')[1].split('.')[0]}</p>
                    </div>
                )
            })
        }
        if (error) {
            messageList = <h4>an error occured...</h4>
        }
        return (
            <div className="container">
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text">Group Messages</h4>
                    <div className="row">
                        <div className="col l9">
                            {messageList}
                            <div style={{}} className="col l11">
                                <form onSubmit={this.createMessage}>
                                    <div className="input-field">
                                        <input value={this.state.text} id="text" onChange={(e) => this.setState({ text: e.target.value })} required type="text" />
                                        <label htmlFor="text">Type a message</label>
                                    </div>
                                    <button type="submit" className="btn btn-waves blue">SEND</button>
                                </form>
                            </div>
                        </div>
                        <ProfileSideNav />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(GroupChat);