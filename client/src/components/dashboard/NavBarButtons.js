import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteUser, logoutUser } from "../../actions/authActions"
class LogOutButton extends Component {
    onLogoutClick = e => {
        e.preventDefault()
        this.props.logoutUser()
    }
    render() {
        return (
            <ListItem button key={"text1"} onClick={this.onLogoutClick}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Log Out"} />
            </ListItem>
        )
    }
}
class DeleteUserButton extends Component {
    render() {
        return (null)
    }
}

// LogOutButton = connect(
//     (state) => ({
//         auth: state.auth
//     }),
//     { logoutUser }
// )(LogOutButton)
// DeleteUserButton = connect(
//     (state) => ({
//         auth: state.auth,
//         profile:state.profile
//     }),
//     { deleteUser }
// )(DeleteUserButton)

// export { LogOutButton, DeleteUserButton }