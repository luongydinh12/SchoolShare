import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import GroupList from './GroupList';

class SearchGroups extends Component {
    state={
        query:'',
        results:-1
    }
    componentDidMount=e=>{
    }
    search= e => { 
        e.preventDefault();
        this.setState({loading: true, error: false})
        const data = {
            query: this.state.query
        }
        axios.get('/api/groups/searchgroups',  {
            params: data
        }).then(res=>{
            console.log(res.data);
            this.setState({results:res.data.length});
            this.props.groupSearchCb(res.data)
        });
    }
    render() {
        const r = this.state.results;
        if (r == -1) {
            return (
                <div className="search">
                    <form onSubmit={this.search}>
                        <input value={this.state.query} id="search" onChange={(e) => this.setState({ query: e.target.value })} required type="text" />
                        <button type="submit" className="btn btn-large waves-effect waves-light hoverable green accent-3">Search</button>
                    </form> 
                </div>
            )
        }
        if(r==0){
            return(
                <div>
                    No results found!
                </div>
            )
        }
        else{
            return(
                <div>
                    {this.state.results} results!
                    this.props
                </div>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(SearchGroups);