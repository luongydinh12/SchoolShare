import axios from 'axios';
import React, { Component } from 'react';
import { Row, Textarea } from 'react-materialize';
import { connect } from 'react-redux';
import ThreadComments from "./ThreadComments";

class ViewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: undefined,
      commentCount: 0,
      loading: true,
      error: false,
      displayReplyBox: false,
      displayEditTitle: false,
      displayEditDesc: false,
      displayDeleteConfirm: false
    };

    this.getPost = this.getPost.bind(this);
    this.renderPost = this.renderPost.bind(this);
    this.renderPostReplyBox = this.renderPostReplyBox.bind(this);
    this.renderEditTitleBox = this.renderEditTitleBox.bind(this);
    this.submitPostReply = this.submitPostReply.bind(this);
    this.submitPostEditTitle = this.submitPostEditTitle.bind(this);
    this.submitPostEditDesc = this.submitPostEditDesc.bind(this);
    this.submitPostDelete = this.submitPostDelete.bind(this);
    this.postReplyClick = this.postReplyClick.bind(this);
    this.editTitleClick = this.editTitleClick.bind(this);
    this.editDescClick = this.editDescClick.bind(this);
    this.postDeleteClick = this.postDeleteClick.bind(this);
    this.closeAll = this.closeAll.bind(this);
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
          <p style={post.deleted?{color:"#7F7F7F"}:{color:"#000000"}}>{post.deleted?"[Post Deleted]":post.content}</p>
          {this.showCommentManagement(post)}
          {this.renderPostReplyBox()}
          {this.renderEditTitleBox()}
          {this.renderEditDescBox()}
          {this.renderDeleteConfirmation()}
          {" "}

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
        <a href="/" onClick={this.closeAll}>
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
  
  renderEditTitleBox() {
    if (!this.state.displayEditTitle) return undefined;
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
            placeholder={"Type your new thread title here"}
            value={this.state.postReplyValue}
            onChange={e => this.setState({ postReplyValue: e.target.value })}
          />
        </Row>
        <a href="/" onClick={this.submitPostEditTitle}>
          Edit
        </a>
        {"\t | \t"}
        <a href="/" onClick={this.closeAll}>
          Cancel
        </a>
      </div>
    );
  }

  submitPostEditTitle(e) {
    e.preventDefault();
    this.setState({ postingReply: true });
    console.log({ state: this.state });

    const thread = this.props.location.pathname.split("/")[3];
    axios
      .post("/api/posts/editTitle", {
        id: thread,
        newtitle: this.state.postReplyValue
      })
      .then(({ data }) => {
        this.state.post.title = this.state.postReplyValue;
      })
      .catch(err => {})
      .finally(() => {
        this.setState({
          displayEditTitle: false,
          postingReply: false,
          postReplyValue: ""
        });
      });
  }

  renderEditDescBox() {
    if (!this.state.displayEditDesc) return undefined;
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
            placeholder={"Type your new thread title here"}
            value={this.state.postReplyValue}
            onChange={e => this.setState({ postReplyValue: e.target.value })}
          />
        </Row>
        <a href="/" onClick={this.submitPostEditTitle}>
          Edit
        </a>
        {"\t | \t"}
        <a href="/" onClick={this.closeAll}>
          Cancel
        </a>
      </div>
    );
  }

  submitPostEditDesc(e) {
    e.preventDefault();
    this.setState({ postingReply: true });
    console.log({ state: this.state });

    const thread = this.props.location.pathname.split("/")[3];
    axios
      .post("/api/posts/editDesc", {
        id: thread,
        newdesc: this.state.postReplyValue
      })
      .then(({ data }) => {
        this.state.post.content = this.state.postReplyValue;
      })
      .catch(err => {})
      .finally(() => {
        this.setState({
          displayEditDesc: false,
          postingReply: false,
          postReplyValue: ""
        });
      });
  }

  renderDeleteConfirmation() {
    if (!this.state.displayDeleteConfirm) return undefined;
    if (this.state.postingDelete) {
      return (
        <div style={{ margin: 10, padding: "5px 15px 0 25px" }}>Deleting...</div>
      );
    }
    return (
      <div style={{ margin: 10, padding: "5px 15px 0 25px" }}>
        <Row style={{ boxShadow: "0px 0px 1px 0px darkseagreen" }}>
          Are you sure you want to delete this thread?{"\t"}
          <a href="/" onClick={this.submitPostDelete}>
            Delete
          </a>
          {"\t | \t"}
          <a href="/" onClick={this.closeAll}>
            Cancel
          </a>
        </Row>
        
      </div>
    );
  }

  submitPostDelete(e) {
    e.preventDefault();
    this.setState({ postingReply: true });
    console.log({ state: this.state });

    const thread = this.props.location.pathname.split("/")[3];
    axios
      .post("/api/posts/deleteThread", {
        id: thread
      })
      .then(({ data }) => {
        this.state.post.deleted = true;
      })
      .catch(err => {})
      .finally(() => {
        this.setState({
          displayDeleteConfirm: false,
          postingReply: false,
          postReplyValue: ""
        });
      });
  }

  postReplyClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: true, displayEditTitle: false, displayEditDesc: false, displayDeleteConfirm: false, postReplyValue: ""});
  }
  editTitleClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayEditTitle: true, displayEditDesc: false, displayDeleteConfirm: false, postReplyValue: this.state.post.title});
  }
  editDescClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayEditTitle: false, displayEditDesc: true, displayDeleteConfirm: false, postReplyValue: this.state.post.content});
  }
  postDeleteClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayEditTitle: false, displayEditDesc: false, displayDeleteConfirm: true});
  }
  closeAll(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayEditTitle: false, displayEditDesc: false, displayDeleteConfirm: false});
  }
  showCommentManagement(post){
    if((this.props.auth.user.id != post.author._id) || post.deleted) return (
      <p><a href="/" onClick={this.postReplyClick}>
      Reply
      </a></p>)
    else return(
      <p>
        <a href="/" onClick={this.postReplyClick}>
          Reply
        </a>
        {"\t | \t"}
          <a href="/" onClick={this.editTitleClick}>
            Edit Title
          </a>
        {"\t | \t"}
          <a href="/" onClick={this.editDescClick}>
            Edit Description
          </a>
        {"\t | \t"}
          <a href="/" onClick={this.postDeleteClick}>
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
          this.state.commentCount === 0 ? (
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