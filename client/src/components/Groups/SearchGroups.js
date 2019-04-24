import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class SearchGroups extends Component {
    state={
        query:'',
        results:this.props.groupSearchResults
    }
    componentDidMount=e=>{
        this.setState({results:this.props.groupSearchResults});
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
            this.setState({results:res.data.length});
            this.props.groupSearchCb(res.data)
        });
    }
    render() {
        return (
            <div className="search">
                <form onSubmit={this.search}>
                    <input value={this.state.query} id="search" onChange={(e) => this.setState({ query: e.target.value })} required type="text" />
                    <button type="submit" className="btn btn-large waves-effect waves-light hoverable green accent-3">Search</button>
                </form> 
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(SearchGroups);