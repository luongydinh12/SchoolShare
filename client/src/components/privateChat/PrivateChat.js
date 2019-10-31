import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import ChatList from './ChatList'
import Chat from './Chat'

class PrivateChat extends Component {
    render() {
        const path = this.props.match.path
        console.log(path)
        return (
            <Switch>
                <Route exact path={path + '/'} component={ChatList} />
                <Route path={path + '/:id'} component={Chat} />
            </Switch>
        )
    }
}

export default PrivateChat