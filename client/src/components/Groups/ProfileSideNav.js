import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

class ProfileSideNav extends Component{

    render(){
        let userProfile = <p>Loading...</p>
        if(this.props.auth){
            userProfile = (
                <Fragment>
                    <p>{this.props.auth.user.name}</p>
                </Fragment>
            )
        }
        return (
            <div className="col l3">
                <h5>Profile</h5>
                <hr/>
                {userProfile}
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(ProfileSideNav);