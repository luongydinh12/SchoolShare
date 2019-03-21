import React, { Component, Fragment } from 'react';
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Categories from './Categories';
import GroupList from './GroupList';
import GroupChat from './GroupChat';
import { Link } from 'react-router-dom';
import CreateGroup from './CreateGroup';

class Groups extends Component {

    render() {
        console.log(this.props.auth)
        return (
            <div >
                <Link to="/groups" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "250px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "192px",
                    marginBottom: "2rem",
                }}>
                    List of Categories
                    </Link>
                <Link to="/create-category" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "250px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "2rem",
                    marginBottom: "2rem",
                }}>
                    Create A Category
                    </Link>
                <Link to="/dashboard" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "250px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "2rem",
                    marginBottom: "2rem",
                }}>
                    Back to Dashboard
              </Link>
                <p style={{ padding: "1px" }}></p>
                <Fragment>
                    <Switch>
                        <Route path={this.props.match.path + '/create'} component={CreateGroup} />
                        <Route path={this.props.match.path + '/category/:id'} component={GroupList} />
                        <Route path={this.props.match.path + '/chat/:id'} component={GroupChat} />
                        <Route path='/' component={Categories} />
                    </Switch>
                </Fragment>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Groups);