import Axios from 'axios'
import M from 'materialize-css'
import React, { Component } from 'react'
import { ProfileListItemFragment } from '../profile/FriendsList'

class CreateChat extends Component {
    state = {
        friends: null,
        chatName: '',
        chatDesc: '',
        checkedFriends: []
    }
    componentDidMount = () => {
        Axios.get('/api/friends/listFriends')
            .then((res) => {
                this.setState({
                    friends: res.data.filter((f) => {
                        return f.status === 'approved'
                    })
                })
            })
    }
    openModal = (e) => {
        M.Modal.init(document.querySelector('.modal'), { endingTop: '20%' }).open()
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const { chatName, chatDesc, checkedFriends } = this.state
        if (!(chatName.length === 0 || chatDesc.length === 0 || checkedFriends.length === 0)) {
            console.log('submit')
            Axios.post('/api/groupchat/create',
                {
                    chatName: chatName,
                    chatDesc: chatDesc,
                    checkedFriends: checkedFriends
                }).then((res) => {
                    M.Modal.getInstance(document.querySelector('.modal')).close()
                    if (this.props.cb) this.props.cb()
                })
        }
    }
    handleCheckFriend = (e) => {
        const val = e.target.value
        const { checkedFriends } = this.state
        const newCheckedFriends = (e.target.checked) ? [...checkedFriends, e.target.value] : checkedFriends.filter((f) => {
            return (f !== val)
        })
        this.setState({ checkedFriends: newCheckedFriends })
    }
    handleNameOnChange = (e) => {
        const val = e.target.value
        this.setState({ chatName: val })
    }
    handleDescOnChange = (e) => {
        const val = e.target.value
        this.setState({ chatDesc: val })
    }
    render() {
        const { friends } = this.state
        if (friends && friends.length > 0) {
            const list = friends.map((f) => {
                return (<div className='row' key={f.friend._id}>
                    <div className='col s10'>
                        <ProfileListItemFragment {...f} dontShowFriendButton={true} className='col s3' />
                    </div>
                    <label className='col s2'>
                        <input onChange={this.handleCheckFriend} value={f.friend._id} type="checkbox" />
                        <span>Add</span>
                    </label>
                </div>)
            })

            return (<div className='container'>
                <div className='row' onClick={this.openModal}>
                    <div className='col'><button className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">add</i></button></div>
                    <div className='col'> <h5>Create New</h5></div>
                </div>
                <div className='modal'>
                    <div className='modal-content'>
                        <h4>New Chat</h4>
                        <div className="input-field col s6">
                            <input id="chat_name" type="text" value={this.state.chatName} onChange={this.handleNameOnChange} />
                            <label htmlFor="chat_name">Chat Name</label>
                        </div>
                        <div className="input-field col s6">
                            <textarea id="chat_desc" className="materialize-textarea" value={this.state.chatDesc} onChange={this.handleDescOnChange} />
                            <label htmlFor="chat_desc">Chat Description</label>
                        </div>
                    </div>
                    <div>
                        <ul className='collection'>
                            {list}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button className="waves-effect waves-red btn-flat" onClick={this.handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>)
        }

        return (<div>You have no friends!</div>)
    }
}

export default CreateChat