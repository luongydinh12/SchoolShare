import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

class Category extends Component {

    constructor(props){
        super(props);

        this.state = {
            posts: null,
            page: 1,
            totalPosts: 0,
            totalPages: 0,
            loading: true,
            error: false
        };

        this.getPosts = this.getPosts.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.previousPage = this.previousPage.bind(this)
    }

    componentDidMount = () => {
        this.getPosts();
    }

    getPosts(_page = undefined){
        this.setState({loading: true})

        const id = this.props.location.pathname.split('/')[2];
        const page = _page ? _page : this.state.page;
        axios.get('/api/posts/getpostsforcat?catId='+id+'&page='+page)
        .then(({data}) => {
            this.setState({...data, loading: false, error: false})
        })
        .catch(err => {
            this.setState({loading: false, error: true})
        })
    }

    nextPage(){
        if(this.state.page < this.state.totalPages){
            const page = this.state.page + 1;
            this.setState({ page });
            this.getPosts(page)
        }
    }
    previousPage(){
        if(this.state.page > 0){
            const page = this.state.page - 1;
            this.setState({ page });
            this.getPosts(page)
        }
    }

    render() {
        console.log(this.props.match)

        let postList = <h4>Loading...</h4>
        let nextButton = null,
        prevButton = null;

        const {posts,totalPosts, totalPages, loading, error} = this.state;
        if(posts && totalPosts){
            postList = posts.map(p => {
                return (
                    <div className="forumThread" key={p._id}>
                        <Link to={'/forum/post/'+p._id} >{p.title}</Link>
                        <p>{p.author.name}</p>
                    </div>
                )
            })
        }if(error){
            postList = <h4>an error occured...</h4>
        }
        if(totalPosts == 0){
            postList = (<h4>No posts yet in this category.</h4>)
        }
        if(loading){
            postList = (<h4>Loading</h4>)
        }
        if(totalPages > 1 && this.state.page < totalPages){
            nextButton = (                <button onClick={(e)=>{e.preventDefault(); this.nextPage()}}  className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                width: "170px",
                borderRadius: "1px",
                marginTop: "3rem",
                marginLeft: "1rem",
                marginBottom: "2rem",
            }}>Next Page</button>)
        }
        if(totalPages > 1 && this.state.page > 1){
            nextButton = (<button onClick={(e)=>{e.preventDefault(); this.previousPage()}}  className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                width: "170px",
                borderRadius: "1px",
                marginTop: "3rem",
                marginLeft: "1rem",
                marginBottom: "2rem",
            }}>Previous Page</button>)
        }
        return (
            <div className="container">
                <div className="card white" style={{ padding: 5 }}>


                <div className="row">
                <div className="col l8">
                <h4 className="center-text" 
                    style= {{marginLeft: "10px",
                    fontFamily: "Urbana",
                    marginLeft: "15px",
                    }}>Discussion Forum</h4>
                </div>
                <div className="col 14">
                <a href="/" onClick={(e)=>{e.preventDefault(); this.props.history.goBack()}}  className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "160px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "1rem",
                    marginBottom: "2rem",
                }}>Go Back</a>
                <Link to={this.props.match.url + "/new"} className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "160px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "1rem",
                    marginBottom: "2rem",
                }}>Create Post </Link>
                </div>
                </div>

                    <div className="row">
                        <div className="col s12" style= {{marginTop: "2rem"}}>
                            {postList}
                        </div>
                    </div>
                    { this.state.totalPages ? (
                    <div className="row">
                        <div className="col s12" style= {{marginTop: "2rem", textAlign: 'right'}}>
                        <p style={{display: 'inline', marginTop: "3rem"}}>Page: {this.state.page}</p>
                            {prevButton}
                            {nextButton}
                        </div>
                    </div>
                    ) : null}
                </div>
            </div>
        )
    }
}

export default Category;