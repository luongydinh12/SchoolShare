import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ProfileSideNav from './ProfileSideNav';
import { Link } from "react-router-dom";

class GroupList extends Component {
    state = {
        groups: null,
        loading: true,
        error: false
    }
    componentDidMount = () => {
        const id = this.props.location.pathname.split('/')[3]
        axios.get('/api/posts/getallgroup?catId='+id)
        .then(result => {
            this.setState({groups: result.data.data, loading: false, error: false})
        })
        .catch(err => {
            this.setState({loading: false, error: true})
        })
    }

    render() {
        let groupList = <h4>Loading...</h4>
        const {groups, loading, error} = this.state;
        if(groups){
            groupList = groups.map(group => {
                return (
                    <Fragment key={group._id}>
                        <Link to={'/groups/chat/'+group._id} 
                        style={{ fontSize: 18, 
                        fontFamily:"Urbana",
                        letterSpacing: "1px",
                        border: '1px solid #2BB673', 
                        padding: 10, 
                        borderRadius: "10px" }} >{group.name}</Link>
                        <br />
                        <p>{group.desc}</p>
                        <br />
                    </Fragment>
                )
            })
        }if(error){
            groupList = <h4>an error occured...</h4>
        }
        return (
            <div className="container">
                <div className="card white" style={{ padding: 5 }}>
                <Link to="/groups/create" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "170px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "1rem",
                    marginBottom: "2rem",
                }}>Create Group </Link>
{/*                 <Link to="/" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "250px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "2rem",
                    marginBottom: "2rem",
                }}>List All Groups </Link> */}
                {/* List All Groups after user selects a category so this button is not needed */}
                    <h4 className="center-text" 
                    style= {{marginLeft: "10px",
                    fontFamily: "Urbana",
                    marginLeft: "15px",
                    }}>List of Groups</h4>
                    <div className="row">
                        <div className="col l9" style= {{marginTop: "2rem"}}>
                            {groupList}
                        </div>
                        {/* <ProfileSideNav /> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default GroupList;