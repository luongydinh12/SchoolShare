import React, { Component } from 'react'
import { Switch } from 'react-router-dom'
import { PropsRoute } from '../private-route/PrivateRoute'
import Chat from './Chat'
import ChatList from './ChatList'

class PrivateChat extends Component {
    render() {
        const path = this.props.match.path
        const socket = this.props.socket
        console.log(socket)
        return (
            <Switch>
                <PropsRoute exact path={path + '/'} component={ChatList} />
                <PropsRoute path={path + '/:id'} component={Chat} socket={socket} />
            </Switch>
        )
    }
}

export default PrivateChat