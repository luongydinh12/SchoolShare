import React, { Component, Fragment } from 'react';
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Categories from './Categories';
import GroupList from './GroupList';
import GroupChat from './GroupChat';
import { Link } from 'react-router-dom';
import CreateGroup from './CreateGroup';
import SearchGroups from './SearchGroups';

class Groups extends Component {

    render() {
        console.log(this.props.auth)
        return (
            <div >
                <div class="container" style={{
                    marginLeft: "auto",
                    marginRight: "auto"
                }}>
                    <Link to="/groups" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                        width: "150px",
                        borderRadius: "1px",
                        marginTop: "3rem",
                        //marginLeft: "192px",
                        marginBottom: "2rem",
                    }}>
                        Categories
                    </Link>
                    <Link to="/create-category" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                        width: "210px",
                        borderRadius: "1px",
                        marginTop: "3rem",
                        marginLeft: "1rem",
                        marginBottom: "2rem",
                    }}>
                        Create A Category
                    </Link>
                    <Link to="/mygroups" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                        width: "150px",
                        borderRadius: "1px",
                        marginTop: "3rem",
                        marginLeft: "1rem",
                        marginBottom: "2rem",
                    }}>
                        My Groups
              </Link>
                    <Link to="/dashboard" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                        width: "150px",
                        borderRadius: "1px",
                        marginTop: "3rem",
                        marginLeft: "1rem",
                        marginBottom: "2rem",
                    }}>
                        Dashboard
              </Link>

              <SearchGroups/>

                </div>
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