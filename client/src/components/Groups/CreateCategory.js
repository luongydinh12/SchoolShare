import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { Link } from 'react-router-dom'

class CreateCategory extends Component {
    state = {
        name: '',
        loading: false,
        error: false,
        success: false,
        errorMsg: null,
    }
    createCategory = e => {
        e.preventDefault();
        this.setState({loading: true, error: false})
        const data = {
            name: this.state.name,
        }
        axios.post('api/posts/creategroupcat', data)
        .then(result => {
            this.setState({success: true, loading: false, name: ''})
        })
        .catch(err => {
            
            this.setState({error: true, loading: false, errorMsg: err.response.data.error})
        })
    }

    render() {
        let msg = null;
        if (this.state.success){
            msg = <p className="green-text">Successfully created a category</p>
        }
        if (this.state.error){
            msg = <p className="red-text">{this.state.errorMsg}</p>
        }
        return (
            <div className="container">
                <Link to="/dashboard" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "250px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "0px",
                    marginBottom: "2rem",
                }}>
                    Back to Dashboard
              </Link>
                <Link to="/groups" className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "250px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "2rem",
                    marginBottom: "2rem",
                }}>
                    List of Categories
                    </Link>
                <div className="card white" style={{ padding: 5 }}>
                
                    <h4 className="center-text" style={{marginLeft: "20px", fontFamily: "Urbana"}}>Create Category</h4>
                    <div className="row">
                        <div className="col l9" style={{marginLeft: "20px"}}>
                            <form onSubmit={this.createCategory}>
                                {msg}
                                <div className="input-field">
                                    <input value={this.state.name} id="name" onChange={(e) => this.setState({name: e.target.value})} required type="text" className="validate" />
                                        <label htmlFor="name">Category Name</label>
                                </div>
                                <button type="submit" className="btn btn-large waves-effect waves-light hoverable green accent-3">Create</button>
                            </form>
                        </div>
                        </div>
                    </div>
                </div>
                )
            }
        }
        
const mapStateToProps = state => {
    return {
                    auth: state.auth
            }
        }
        
export default connect(mapStateToProps)(CreateCategory);