import React, { Component, Fragment} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Button, Modal} from 'react-materialize';

class GroupChat extends Component {
    state = {
        messages: null,
        loading: true,
        error: false,
        text: '',
        editing: false,
        members: null,
        msgId: null,
        openDeleteModal: false,
        msgDeleteId: null
    }
    fetchChats = () => {
        const id = this.props.location.pathname.split('/')[3]
        axios.get('/api/groups/getgroup?id=' + id)
            .then(result => {
                this.setState({ messages: result.data.data.messageId, members: result.data.data.membersName, error: false, loading: false })
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
        if(!this.state.editing) {
            const id = this.props.location.pathname.split('/')[3]
            const data = {
                text: this.state.text,
                createdByName: this.props.auth.user.name,
                createdBy: this.props.auth.user.id,
                groupId: id,
            }
            axios.post('/api/groups/createmsg', data)
                .then(result => {
                    this.fetchChats();
                    this.setState({ text: '' })
                })
        } else {
            const data = {
                msgId: this.state.msgId,
                text: this.state.text
            }
            axios.post('/api/groups/editmsg', data) 
            .then(res => {
                this.setState({editing: false, text: ''})
                this.fetchChats();
            })
        }
    }
    editMessage = (e, text, id) => {
        e.preventDefault();
        this.setState({text: text, msgId: id, editing: true})
    }
    showDeleteModal = (e, id) => {
        e.preventDefault();
        this.setState({openDeleteModal: true, msgDeleteId: id})
    }
    deleteMessage = () => {
        const data = {
            msgId: this.state.msgDeleteId
        }
        axios.post('/api/groups/deletemsg', data)
        .then(res => {
            this.setState({openDeleteModal: false})
            this.fetchChats();
        })
    }

    joinGroup = e => {
        const id = this.props.location.pathname.split('/')[3]
        axios.get('/api/groups/joingroup?user=' + this.props.auth.user.id + '&id=' + id + '&name=' + this.props.auth.user.name)
            .then(result => {
                this.fetchChats();
            })
            .catch(err => {
                console.log('Something went wrong')
            })
    }
    leaveGroup = e => {
        const id = this.props.location.pathname.split('/')[3]
        axios.get('/api/groups/leaveGroup?user=' + this.props.auth.user.id + '&id=' + id + '&name=' + this.props.auth.user.name)
            .then(result => {
                this.fetchChats();
            })
            .catch(err => {
                console.log('Something went wrong')
            })
    }
    render() {
        let messageList = <h4 style={{fontFamily: "Urbana",}}>Loading...</h4>
        let membersList = <p style={{fontFamily: "Urbana",}}>Loading...</p>
        let joinButton = null, leaveButton = null, leaveModal = null, deleteModal = null, editDelete = null;
        let messageForm = null;
        const { messages, error, members } = this.state;
        if (messages) {
            messageList = messages.map(message => {
                const userName = this.props.auth.user.name
                if (!this.state.members.includes(userName)) {
                    editDelete = null;
                } else {
                    const deleteBtn = this.props.auth.user.id===message.createdBy&&(this.state.members.find(el => el === this.props.auth.user.name))?<a onClick={e => this.showDeleteModal(e, message._id)} style={{marginRight: 10, color: 'red'}}>DELETE</a>:null
                    editDelete = (
                        <Fragment>
                            <Modal options={{opacity: .2}} header="Confirmation" open={this.state.openDeleteModal}
                            actions={[<Button  waves="green" modal="close" flat onClick={()=>this.deleteMessage()}>Yes</Button>, <Button onClick={e => this.setState({openDeleteModal: false})} waves="green" flat>No</Button>]}
                            >
                                <p>
                                Are you sure you want to delete this comment?
                                </p>
                            </Modal>
                            {deleteBtn}
                            {this.props.auth.user.id === message.createdBy&&(this.state.members.find(el => el === this.props.auth.user.name))?
                                <a onClick={e => this.editMessage(e, message.text, message._id)} style={{marginRight: 10}}>EDIT</a>:null}
                        </Fragment>
                    )
                }              
                
                
                return (
                    <div key={message._id} className="card white col l11 darken-2" style={{ padding: 5 }}>
                        <p>{message.text}</p>
                        <p style={{ fontSize: 10 }}>{message.createdByName} {message.date.split('T')[0]} {message.date.split('T')[1].split('.')[0]}</p>
                        {editDelete}
                    </div>
                )
            })
            membersList = members.map(member => {
                return <p key={member}>{member}</p>
            })
            const userName = this.props.auth.user.name
            if (!members.includes(userName)) {
                joinButton = <button className="btn btn-large waves-effect waves-light hoverable green accent-3" 
                onClick={this.joinGroup}
                style ={{marginTop: "3rem",
                marginLeft: "1rem", 
                width: "150px"}} >JOIN GROUP</button>
            } else {
                leaveButton = <button className="btn btn-large waves-effect waves-light hoverable green accent-3" 
                style ={{marginTop: "3rem",
                marginLeft: "1rem", 
                width: "150px"}} >LEAVE GROUP</button>;
                leaveModal = (<Modal trigger={leaveButton} header="Confirmation" actions={[<Button  waves="green" modal="close" flat onClick={()=>this.leaveGroup()}>Yes</Button>, <Button  waves="green" modal="close" flat>No</Button>]}>
                Are you sure you want to leave this group?
                </Modal>);
                
                messageForm = (
                    <form onSubmit={this.createMessage}>
                        <div className="input-field">
                            <input placeholder="Type a message" value={this.state.text} id="text" onChange={(e) => this.setState({ text: e.target.value })} required type="text" />
                            {/* <label htmlFor="text">Type a message</label> */}
                        </div>
                        <button type="submit" className="btn btn-large waves-effect waves-light hoverable green accent-3"
                        style={{width: "150px"}}>SEND</button>
                        {this.state.editing?<button onClick={() => this.setState({editing: false, text: ''})} type="button" className="btn btn-large waves-effect waves-light hoverable red accent-3"
                        style={{width: "fit-content", marginLeft: 20}}>CANCEL EDITING</button>:null}
                    </form>
                )
            }
        }
        if (error) {
            messageList = <h4>an error occured...</h4>
        }
        return (
            <div className="container">
                <div className="card white custom-modal-btn" style={{ padding: 5 }}>

                <button onClick={this.props.history.goBack} className="btn btn-large waves-effect waves-light hoverable green accent-3"
                style={{marginLeft: "25px",
                marginTop: "3rem",
                width: "150px"}}>Go Back</button>
                    {joinButton}           
                    {leaveModal}
                    <h4 className="center-text" 
                    style ={{fontFamily: "Urbana",
                    marginLeft: "23px"}}>Group Messages</h4>
                    <div className="row">
                        <div className="col l9">
                            {messageList}
                            <div style={{}} className="col l11">
                                {messageForm}
                            </div>
                        </div>
                        <div className="col l3">
                            <h6 style= {{fontFamily: "Urbana", fontSize: "20px"}}>Members</h6>
                            <hr />
                            {membersList}
                        </div>
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