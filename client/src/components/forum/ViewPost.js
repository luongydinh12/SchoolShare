import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Textarea, Row, Button } from 'react-materialize';
import ThreadComments from "./ThreadComments";
import Modal from 'react-materialize/lib/Modal';

class ViewPost extends Component {
  constructor(props) {
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
    this.renderPostReplyBox = this.renderPostReplyBox.bind(this);
    this.submitPostReply = this.submitPostReply.bind(this);
    this.postReplyClick = this.postReplyClick.bind(this);
    this.closeReplyClick = this.closeReplyClick.bind(this);
    this.showCommentManagement = this.showCommentManagement.bind(this);
  }

  componentDidMount = () => {
    this.getPost();
  };

  getPost() {
    this.setState({ loading: true });

    const id = this.props.location.pathname.split("/")[3];
    axios
      .get("/api/posts/getpostbyid?id=" + id)
      .then(({ data }) => {
        this.setState({
          post: data,
          commentCount: data.commentCount,
          loading: false,
          error: false
        });
      })
      .catch(err => {
        console.log({ err });
        this.setState({ loading: false, error: true });
      });
  }

  renderPost(post) {
    return (
      <>
        <div className="postContent">
          <p style={{ color: "#2BB673", fontWeight: 600 }}>
            {post.author.name}:
          </p>
          <p>{post.content}</p>
          {this.showCommentManagement(post.author._id)}
          {this.renderPostReplyBox()}{" "}

        </div>
      </>
    );
  }
  
  renderPostReplyBox() {
    if (!this.state.displayReplyBox) return undefined;
    if (this.state.postingReply) {
      return (
        <div style={{ margin: 10, padding: "5px 15px 0 25px" }}>Posting...</div>
      );
    }
    return (
      <div style={{ margin: 10, padding: "5px 15px 0 25px" }}>
        <Row style={{ boxShadow: "0px 0px 1px 0px darkseagreen" }}>
          <Textarea
            s={12}
            m={12}
            l={12}
            xl={12}
            placeholder={"Type your reply here"}
            value={this.state.postReplyValue}
            onChange={e => this.setState({ postReplyValue: e.target.value })}
          />
        </Row>
        <a href="/" onClick={this.submitPostReply}>
          Reply
        </a>
        {"\t | \t"}
        <a href="/" onClick={this.closeReplyClick}>
          Cancel Reply
        </a>
      </div>
    );
  }

  submitPostReply(e) {
    e.preventDefault();
    this.setState({ postingReply: true });
    console.log({ state: this.state });

    const thread = this.props.location.pathname.split("/")[3];
    axios
      .post("/api/posts/postReply", {
        content: this.state.postReplyValue,
        thread,
        parent: thread,
        author: this.props.auth.user.id
      })
      .then(({ data }) => {
        this.setState({ commentCount: this.state.commentCount + 1 });
      })
      .catch(err => {})
      .finally(() => {
        this.setState({
          displayReplyBox: false,
          postingReply: false,
          postReplyValue: ""
        });
      });
  }
  postReplyClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: true });
  }
  closeReplyClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: false });
  }
  showCommentManagement(e){
    if(this.props.auth.user.id != e) return (
      <p><a href="/" onClick={this.postReplyClick}>
      Reply
      </a></p>)
    else return(
      <p>
        <a href="/" onClick={this.postReplyClick}>
          Reply
        </a>
        {"\t | \t"}
          <a href="/" onClick={this.postReplyClick}>
            Edit
          </a>
        {"\t | \t"}
          <a href="/" onClick={this.postReplyClick}>
            Delete
          </a>
      </p>
    );
  }

  // DELETE THREAD ()

  render() {
    console.log(this.props.match);
    const id = this.props.location.pathname.split("/")[3];

    let postHTML = <h4>Loading...</h4>;

    const { post, loading, error } = this.state;
    if (post) {
      postHTML = this.renderPost(post);
    }
    if (error) {
      postHTML = <h4>an error occured...</h4>;
    }
    if (loading) {
      postHTML = <h4>Loading</h4>;
    }

    return (
      <div className="container">
        <div className="card white" style={{ padding: 5 }}>
          <div className="row">
            <div className="col l7">
              <h4
                className="center-text"
                style={{
                  marginTop: "3rem",
                  fontFamily: "Urbana",
                  marginLeft: "15px"
                }}
              >
                {post ? post.title : null}
              </h4>
            </div>
            <div className="col l5">
              <a
                href="/"
                onClick={e => {
                  e.preventDefault();
                  this.props.history.goBack();
                }}
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
                style={{
                  width: "170px",
                  borderRadius: "1px",
                  marginTop: "3rem",
                  marginLeft: "1rem",
                  marginBottom: "2rem"
                }}
              >
                Go Back
              </a>
            </div>
          </div>

          <div className="row">
            <div className="col s12">{postHTML}</div>
          </div>

          {this.state.loading ||
          this.state.postingReply ||
          this.state.commentCount == 0 ? (
            undefined
          ) : (
            <div className="row">
              <div className="col s12">
                <div className="postContent">
                  <ThreadComments id={id} {...this.props} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ViewPost);