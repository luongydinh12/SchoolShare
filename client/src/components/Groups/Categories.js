import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ProfileSideNav from './ProfileSideNav';
import axios from 'axios';

class Groups extends Component {
    state = {
        categories: null,
        loading: true,
        error: false,
    }
    componentDidMount = () => {
        axios.get('api/posts/getallgroupcat')
            .then(result => {
                this.setState({ categories: result.data, loading: false, error: false })
            })
            .catch(err => {
                this.setState({ error: true, loading: false })
            })
    }

    render() {
        let cat = null;
        const { categories, loading, error } = this.state;
        if (loading) {
            cat = <h4>Loading...</h4>
        }
        if (categories !== null) {
            cat = categories.data.map(category => {
                return (
                    <div style= {{marginBottom: "20px"}}>           
                    <Fragment key={category._id}>
                        <Link to={'/groups/category/'+category._id} 
                        style={{ fontSize: 18, 
                        fontFamily: "Urbana",
                        //fontWeight: "bold",
                        letterSpacing: "1px",
                        border: '1px solid #2BB673', 
                        padding: 10, 
                        borderRadius: "10px" }} >{category.name}</Link>
                        <br />
                        <br />
                    </Fragment>
                    </div>
                )
            })
        }
        if (error){
            cat = <h4>an error occured...</h4>
        }
        return (
            <div className="container">
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text" 
                    style ={{marginBottom: "50px", 
                    marginLeft: "10px",
                    fontFamily: "Urbana" }}>List of Categories</h4>
                    <div className="row">
                        <div className="col l9">
                            {cat}
                        </div>
                       {/*  <ProfileSideNav /> */}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Groups);