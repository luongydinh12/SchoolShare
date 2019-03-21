import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ProfileSideNav from './ProfileSideNav';
import { connect } from 'react-redux';

class CreateGroup extends Component {

    render() {
        return (
            <div className="container">
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text" 
                    style={{fontFamily: "Urbana",
                    marginLeft: "20px"}}>Create New Group</h4>
                    <div className="row">
                        <div className="col l9">
                            {/* {messageList} */}
                            <div style={{}} className="col l11">
                                <form onSubmit={this.createMessage}>
                                    <div className="input-field">
                                        <input id="text" onChange={(e) => this.setState({ text: e.target.value })} required type="text" />
                                        <label htmlFor="text">Group Name</label>
                                    </div>
                                    <button type="submit" className="btn btn-large waves-effect waves-light hoverable green accent-3">Create</button>
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

const mapStateToProps = state =>{
    return {
        auth: state.auth,
    }
}

export default connect(mapStateToProps)(CreateGroup)