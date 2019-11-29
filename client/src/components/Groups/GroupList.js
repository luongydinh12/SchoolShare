import axios from 'axios';
import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";

class GroupList extends Component {
    state = {
        groups: null,
        loading: true,
        error: false,
        zeroSearchResults:null
    }
    componentDidMount = () => {   
        console.log(this.props.groupSearchResults)    
        if(!this.props.groupSearchResults){
            console.log("not from search")
            this.setState({searchNumber:0})
            const id = this.props.location.pathname.split('/')[3]
            axios.get('/api/groups/getallgroups?catId=' + id)
                .then(result => {
                    this.setState({ groups: result.data.data, loading: false, error: false })
                })
                .catch(err => {
                    this.setState({ loading: false, error: true })
                })
        }
        else{
            const results=this.props.groupSearchResults
            if(results===-1){
                console.log("no search results")
                this.setState({groups:null, loading:false,error:false,zeroSearchResults:true})
            }
            else{
                console.log("search results present")
                this.setState({groups:results, loading:false,error:false, zeroSearchResults:false})
            }
            //this.props.clearSearchState()
        }
    }
    componentDidUpdate=(prevProps)=>{ //if it's already displaying a groupslist component
        if (this.props.groupSearchResults!== prevProps.groupSearchResults) {//prevents loop on setstate
            const results=this.props.groupSearchResults
            if(results===-1){
                this.setState({groups:null, loading:false,error:false,zeroSearchResults:true})
            }
            else{
                this.setState({groups:results, loading:false,error:false, zeroSearchResults:false})
            }
          }       
    }
 
    render() {
        let groupList = <h4 style={{fontFamily: "Urbana",}}>Loading...</h4>
        const {groups, error} = this.state;

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
        if(this.state.zeroSearchResults){
            groupList= <h4>No search results.</h4>
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

                    <h4 className="center-text" 
                    style= {{marginLeft: "15px",
                    fontFamily: "Urbana",
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