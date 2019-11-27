import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import Axios from 'axios';
import React, { Component } from 'react';
class EditProfileButton extends Component {
    state = {
        profile: null
    }
    componentWillMount() {
        Axios.get('/api/profile/')
            .then((res) => {
                this.setState({ profile: res.data })
            })
    }
    render() {
        if (this.state.profile) return (
            <ListItem component="a" href="/edit-profile">
                <ListItemIcon>
                    <EditIcon />
                </ListItemIcon>
                <ListItemText primary={"Edit Profile"} />
            </ListItem>
        )
        return null
    }
}
export { EditProfileButton };
// class LogOutButton extends Component {
//     onLogoutClick = e => {
//         e.preventDefault()
//         this.props.logoutUser()
//     }
//     render() {
//         return (
//             <ListItem button key={"text1"} onClick={this.onLogoutClick}>
//                 <ListItemIcon>
//                     <InboxIcon />
//                 </ListItemIcon>
//                 <ListItemText primary={"Log Out"} />
//             </ListItem>
//         )
//     }
// }
// class DeleteUserButton extends Component {
//     render() {
//         return (null)
//     }
// }

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