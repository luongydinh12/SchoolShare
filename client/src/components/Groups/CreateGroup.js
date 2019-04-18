import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ProfileSideNav from './ProfileSideNav';
import { connect } from 'react-redux';
//import { $ } from 'jquery';

class CreateGroup extends Component {
    state = {
        name: '',
        desc: '',
        category: '',
        loading: false,
        success: false,
        error: false,
        errorMsg: '',
        categories: null,
    }
    componentDidMount = () => {
        axios.get('/api/posts/getallcategories')
            .then(result => {
                this.setState({ error: false, categories: result.data.data })
            })
            .catch(err => {
                this.setState({ error: true })
            })
    }

    CreateGroup = (e) => {
        e.preventDefault()
        const { name, desc, category } = this.state;
        const createdBy = this.props.auth.user.id;
        const data = {
            name: name,
            desc: desc,
            createdBy: createdBy,
            catId: category
        }
        axios.post('/api/posts/creategroup', data)
            .then(result => {
                this.setState({ success: true, name: '', desc: '', error: false })
            })
            .catch(err => {
                this.setState({ error: true, errorMsg: err.response.data.error })
            })
    }
    render() {
        let categoryList = null;
        if (this.state.categories) {
            categoryList = this.state.categories.map(category => {
                return <option value={category._id} key={category._id}>{category.name}</option>
            })
        }
        return (
            <div className="container">
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text" style={{marginLeft: "20px", fontFamily: "Urbana"}}>Create New Group</h4>
                    <div className="row">
                        <div className="col l9">
                            {this.state.success ? <p className='green-text'>Your group has been created succesfully</p> : null}
                            {this.state.error ? <p className='red-text'>{this.state.errorMsg}</p> : null}
                            <div style={{}} className="col l11">
                                <form onSubmit={this.CreateGroup}>
                                    <div className="input-field">
                                        <select className="browser-default" value={this.state.category} onChange={e => this.setState({ category: e.target.value })}>
                                            <option value="">Select Category</option>
                                            {categoryList}
                                        </select>
                                    </div>
                                    <div className="input-field">
                                        <input value={this.state.name} id="text" onChange={(e) => this.setState({ name: e.target.value })} required type="text" />
                                        <label htmlFor="text">Group name</label>
                                    </div>
                                    <div className="input-field">
                                        <textarea value={this.state.desc} onChange={e => this.setState({ desc: e.target.value })}
                                            id="textarea1" className="materialize-textarea"></textarea>
                                        <label htmlFor="textarea1">Description</label>
                                    </div>
                                    <button type="submit" className="btn btn-large waves-effect waves-light hoverable green accent-3">CREATE</button>
                                </form>
                            </div>
                        </div>
                        {/* <ProfileSideNav /> */}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}

export default connect(mapStateToProps)(CreateGroup)