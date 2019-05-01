import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Textarea, Row, Button } from 'react-materialize';
import Modal from 'react-materialize/lib/Modal';

class ViewPost extends Component {

    constructor(props){
        super(props);

        this.state = {
            post: undefined,
            commentCount: 0,
            loading: true,
            error: false,
            displayReplyBox: false
        };

        this.getPost = this.getPost.bind(this);
        this.renderPost = this.renderPost.bind(this);


    }

    componentDidMount = () => {
        this.getPost();
    }

    getPost(){
        this.setState({loading: true})

        const id = this.props.location.pathname.split('/')[3];
        axios.get('/api/posts/getpostbyid?id='+id)
        .then(({data}) => {
            this.setState({post: data, commentCount: data.commentCount, loading: false, error: false})
        })
        .catch(err => {
            console.log({err})
            this.setState({loading: false, error: true})
        })
    }

    renderPost(post){
        return(
            <>
            <div className="postContent">
                <p style={{color: '#2BB673', fontWeight: 600}}>{post.author.name}:</p>
                <p>{post.content}</p>


            </div>
            </>
        );
    }


    // REPLY ()
    // DELETE THREAD ()


    render() {
        console.log(this.props.match)
        const id = this.props.location.pathname.split('/')[3];

        let postHTML = <h4>Loading...</h4>;


        const {post, loading, error} = this.state;
        if(post){
            postHTML = this.renderPost(post);
        }if(error){
            postHTML = <h4>an error occured...</h4>
        }
        if(loading){
            postHTML = (<h4>Loading</h4>)
        }


     
        return (
            <div className="container">
                <div className="card white" style={{ padding: 5 }}>
                <div className="row">
                <div className="col l7">
                <h4 className="center-text" 
                    style= {{marginTop: "3rem",
                    fontFamily: "Urbana",
                    marginLeft: "15px",
                    }}>{post ? post.title : null}</h4>
                </div>
                <div className="col l5">
                <a href="/" onClick={(e)=>{e.preventDefault(); this.props.history.goBack()}}  className="btn btn-large waves-effect waves-light hoverable green accent-3" style={{
                    width: "170px",
                    borderRadius: "1px",
                    marginTop: "3rem",
                    marginLeft: "1rem",
                    marginBottom: "2rem",
                }}>Go Back</a>
                
                 
                </div>
                </div>

                    <div className="row">
                        <div className="col s12">
                            {postHTML}
                        </div>
                    </div>
                    
                    {/* COMMENTS*/}

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ViewPost);