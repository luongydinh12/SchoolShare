import axios from 'axios';
import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
class MySaves extends Component {
    state = {
        posts: null,
        loading: true,
        error: false
    }
    componentDidMount = () => {
        //const id = this.props.location.pathname.split('/')[3]
        axios.get('/api/posts/getmyposts?user=' + this.props.auth.user.id)
            .then(result => {
                this.setState({ posts: result.data.data, loading: false, error: false })
            })
            .catch(err => {
                this.setState({ loading: false, error: true })
            })
    }

    render() {
        let postList = <h4 style ={{fontFamily: "Urbana",}}>Loading...</h4>
        //console.log(posts)
        const { posts, error } = this.state;
        if (posts) {
            postList = posts.map(post => {
                return (
                    <div className="forumThread"  key={post._id}>
                        <Link to={'/forum/post/' + post._id} 
                            style={{

                            }} >{post.title}</Link>
                    
                    </div>
                )
            })
        } if (error) {
            postList = <h4>an error occured...</h4>
        }
        return (
            
            <div>
                <div class="container" style={{
                    marginLeft: "auto",
                    marginRight: "auto"
                }}>

          <Link
            to="/forum"
            className="btn btn-large waves-effect waves-light hoverable green accent-3"
            style={{
              width: "180px",
              borderRadius: "1px",
              marginTop: "3rem",
              marginBottom: "2rem"
            }}
          >
            Forum
          </Link>
                </div>
                <p style={{ padding: "1px" }}></p>
                <div className="container">
                    <div className="card white" style={{ padding: 5 }}>
                        <h4 className="center-text"
                            style={{
                                fontFamily: "Urbana",
                                marginLeft: "15px",
                            }}>My Saves</h4>
                        <div className="row">
                            <div className="col s12" style={{ marginTop: "2rem" }}>
                                {postList}
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

export default connect(mapStateToProps)(MySaves);