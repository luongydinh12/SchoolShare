import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
//import Spinner from "../common/Spinner";
class MyGroups extends Component {
    state = {
        groups: null,
        loading: true,
        error: false
    }
    componentDidMount = () => {
        //const id = this.props.location.pathname.split('/')[3]
        axios.get('/api/groups/getmygroups?user=' + this.props.auth.user.id)
            .then(result => {
                this.setState({ groups: result.data.data, loading: false, error: false })
            })
            .catch(err => {
                this.setState({ loading: false, error: true })
            })
    }

    render() {
        let groupList = <h4 style ={{fontFamily: "Urbana",}}>Loading...</h4>
        //let groupList = <Spinner />
        const { groups, error } = this.state;
        if (groups) {
            groupList = groups.map(group => {
                return (
                    <Fragment key={group._id}>
                        <Link to={'/groups/chat/' + group._id}
                            style={{
                                fontSize: 18,
                                fontFamily: "Urbana",
                                letterSpacing: "1px",
                                border: '1px solid #2BB673',
                                padding: 10,
                                borderRadius: "10px"
                            }} >{group.name}</Link>
                        <br />
                        <p>{group.desc}</p>
                        <br />
                    </Fragment>
                )
            })
        } if (error) {
            groupList = <h4>an error occured...</h4>
        }
        return (
            <div>
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
                </div>
                <p style={{ padding: "1px" }}></p>
                <div className="container">
                    <div className="card white" style={{ padding: 5 }}>
                        <h4 className="center-text"
                            style={{
                                fontFamily: "Urbana",
                                marginLeft: "15px",
                            }}>My Groups</h4>
                        <div className="row">
                            <div className="col l9" style={{ marginTop: "2rem" }}>
                                {groupList}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(MyGroups);