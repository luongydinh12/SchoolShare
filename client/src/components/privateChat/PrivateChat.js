import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch } from 'react-router-dom'
import { PropsRoute } from '../private-route/PrivateRoute'
import Chat from './Chat'
import ChatList from './ChatList'

class PrivateChat extends Component {
    render() {
        const path = this.props.match.path
        const socket = this.props.socket
        const io = this.props.io
        return (
            <Switch>
                <PropsRoute exact path={path + '/'} component={ChatList} />
                <PropsRoute exact path={path + '/:id'} component={Chat} io={this.props.io} />
            </Switch>
        )
    }
}

export default connect(state => ({
    auth: state.auth,
    profile: state.profile,
}))(PrivateChat)