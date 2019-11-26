import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Textarea, Row, ProgressBar } from "react-materialize";
import likeIcon from '../../icons/Like/likeicon.jpg';
import unlikeIcon from '../../icons/Like/unlikeicon.jpg';
import Button from '@material-ui/core/Button';

class ThreadComments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: undefined,
      loading: true,
      error: false
    };

    this.getComments = this.getComments.bind(this);
  }

  componentDidMount = () => {
    this.getComments();
  }; 

  getComments() {
    this.setState({ loading: true });

    const id = this.props.id;
    axios
      .get("/api/posts/getComments?id=" + id)
      .then(({ data }) => {
        this.setState({ comments: data, loading: false, error: false });
      })
      .catch(err => {
        this.setState({ loading: false, error: true });
      });
  }

  render() {
    //console.log("ThreadComments", { state: this.state });
    if (Array.isArray(this.state.comments)) {
      if (this.state.comments.length) {
        return (
          <div>
            {this.state.comments.map(c => (
              // <RenderComment key={c._id} c={c} {...this.props} />
              <RenderComment getComments={this.getComments} key={c._id} c={c} {...this.props} />
            ))}
          </div>
        );
      }
    }
    return "";
  }
}

class RenderComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: undefined,
      loading: true,
      error: false,
      postingReply: false,
      postingEdit: false,
      postingDelete: false,
      displayReplyBox: false,
      displayEditBox: false,
      displayDeleteBox: false,
      commentId: null,
      authorHandle: "",
    };

    this.getReplies = this.getReplies.bind(this);
    this.renderPostReplyBox = this.renderPostReplyBox.bind(this);
    this.renderPostEditBox = this.renderPostEditBox.bind(this);
    this.submitPostReply = this.submitPostReply.bind(this);
    this.postReplyClick = this.postReplyClick.bind(this);
    this.postEditClick = this.postEditClick.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.postDeleteClick = this.postDeleteClick.bind(this);
    this.closeAll = this.closeAll.bind(this);
    this.showCommentManagement = this.showCommentManagement.bind(this);
    this.likeComment = this.likeComment.bind(this);
    this.unlikeComment = this.unlikeComment.bind(this);
  }

  componentDidMount = () => {
    this.hasProfile(this.props.c.author._id);
    this.getReplies();
  };

  getReplies() {
    this.setState({ loading: true });

    const id = this.props.c._id;
    axios
      .get("/api/posts/getComments?id=" + id)
      .then(({ data }) => {
        this.setState({ comments: data, loading: false, error: false });
      })
      .catch(err => {
        this.setState({ loading: false, error: true });
      });
  }

  renderPostReplyBox() {
    if (!this.state.displayReplyBox) return undefined;
    if (this.state.postingReply) {
      return (
        <ProgressBar/>
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

  renderPostEditBox(commentId) {
    if (!this.state.displayEditBox) return undefined;
    if (this.state.postingEdit) {
      return (
        <ProgressBar/>
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
            placeholder={"Type your revised message here"}
            value={this.state.postReplyValue}
            onChange={e => this.setState({ postReplyValue: e.target.value })}
          />
        </Row>
        <a href="/" onClick={this.submitEdit}>
          Revise
        </a>
        {"\t | \t"}
        <a href="/" onClick={this.closeAll}>
          Cancel Edit
        </a>
      </div>
    );
  }

  likeComment (e, commentId, userId) {
    e.preventDefault();
    const data = {
      commentId: commentId,
      userId: userId
    }
    axios
    .post('/api/posts/likeComment', data)
    .then(res => {
      this.props.getComments();
    })
  }

  unlikeComment (e, commentId, userId) {
    e.preventDefault();
    const data = {
      commentId: commentId,
      userId: userId
    }
    axios
    .post('/api/posts/unlikeComment', data)
    .then(res => {
      this.props.getComments();
    })
  }

  renderDeleteConfirmation() {
    if (!this.state.displayDeleteBox) return undefined;
    if (this.state.postingDelete) {
      return (
        <ProgressBar/>
      );
    }
    return (
      <div style={{ margin: 10, padding: "5px 15px 0 25px" }}>
        <Row style={{ boxShadow: "0px 0px 1px 0px darkseagreen" }}>
          Are you sure you want to delete this post?{"\t"}
          <a href="/" onClick={this.deleteComment}>
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

  postReplyClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: true, displayDeleteBox: false, displayEditBox: false, postReplyValue: "", });
  }
  closeAll(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayDeleteBox: false, displayEditBox: false });
  }
  postDeleteClick(e){
    e.preventDefault();
    this.setState({displayReplyBox: false, displayDeleteBox: true, displayEditBox: false });
  }
  postEditClick(e){
    e.preventDefault();
    this.setState({displayReplyBox: false, displayDeleteBox: false, displayEditBox: true, postReplyValue: this.props.c.content });
  }

  showCommentManagement(e){
    if(this.props.auth.user.id !== e || this.props.c.deleted) return (
      <p><a href="/" onClick={this.postReplyClick}>
      Reply
      </a></p>)
    else return(
      <p>
        <a href="/" onClick={this.postReplyClick}>
          Reply
        </a>
        {"\t | \t"}
          <a href="/" onClick={this.postEditClick}>
            Edit
          </a>
        {"\t | \t"}
          <a href="/" onClick={this.postDeleteClick}>
            Delete
          </a>
      </p>
    )
  }

  submitPostReply(e) {
    e.preventDefault();
    this.setState({ postingReply: true });
    console.log({ state: this.state });

    const id = this.props.c._id;
    axios
      .post("/api/posts/postReply", {
        content: this.state.postReplyValue,
        parent: id,
        author: this.props.auth.user.id
      })
      .then(({ data }) => {
        if (Array.isArray(this.state.comments))
          this.setState({ comments: [...this.state.comments, data] });
      })
      .catch(err => {})
      .finally(() => {
        this.setState({
          displayReplyBox: false,
          postReplyValue: "",
          postingReply: false
        });
      });
  }

  submitEdit(e) {
    e.preventDefault();
    this.setState({ postingEdit: true });
    console.log({ state: this.state });

    const id = this.props.c._id;
    axios
      .post("/api/posts/editComment", {
        id: id,
        content: this.state.postReplyValue
      })
      .then(({ data }) => {
        console.log(this.props.c);
        this.props.c.content = this.state.postReplyValue;
      })
      .catch(err => {})
      .finally(() => {
        this.setState({
          displayEditBox: false,
          postReplyValue: "",
          postingEdit: false
        });
      });
  }

  deleteComment(e){
    e.preventDefault();
    this.setState({ postingDelete: true });
    console.log({ state: this.state });

    const id = this.props.c._id;
    axios
      .post("/api/posts/deleteComment", {
        id: id
      })
      .then(({ data }) => {
        this.props.c.deleted = true;
      })
      .catch(err => {})
      .finally(() => {
        this.setState({
          displayDeleteBox: false,
          postReplyValue: "",
          postingDelete: false
        });
      });
  }

  hasProfile=(userId)=> {
    axios.get("/api/profile/user/"+userId)
        .then(({data}) => {this.setState({authorHandle: data.handle})})
        .catch(err => {
          this.setState({authorHandle: ""});
        });
  }

  render() {
    //console.log("RenderComment", { state: this.state });
    const { c: comment } = this.props;
    const loggedInUserId = this.props.auth.user.id;

    return (
      <>
        <div className="row" style={{ marginBottom: 0 }}>
          <div className="col s12">
            <div
              className="postContent"
              style={{ boxShadow: "unset", border: "none", margin: 0 }}
            >
              <div style={{ color: "#2BB673", fontWeight: 600 }}>
                {(comment.author)?
                  ((this.state.authorHandle)?
                    <a style={{ color: "#2BB673", fontWeight: 600 }} href={"/profile/"+this.state.authorHandle}>{comment.author.name}</a>:
                    comment.author.name)
                  :"[deleted]"}
              </div>
              <p style={comment.deleted?{color:"#7F7F7F"}:{color:"#000000"}}>{comment.deleted?"[comment deleted]":comment.content}</p>
              {this.showCommentManagement(comment.author._id)}
              {this.renderPostReplyBox()}
              {this.renderPostEditBox(comment._id)}
              {this.renderDeleteConfirmation()}
              {!comment.deleted?
              <span style={{color: "rgb(44, 127, 252)", margin: "0px", width: "fit-content" }}>
                {comment.likes.length}{" "}
                {comment.likes.length >= 2 ? (<span style={{ color: "rgb(44, 127, 252)" }}>Likes</span>) : 
                (<span style={{ color: "rgb(44, 127, 252)" }}>Like</span>)}
              </span>:null}

              {!comment.deleted?<a>
              {!comment.likes.find(el => el.user === loggedInUserId) ? (
                <Button 
                  style={{ color: "rgb(44, 127, 252)", marginLeft: 15 }}
                  href="/"
                  onClick={e => this.likeComment(e, comment._id, loggedInUserId)}
                >
                  <img src={likeIcon} alt="Like" height="17" width="17"></img>
                </Button>
              ) :                 
              (<Button
              style={{ color: "rgb(44, 127, 252)", marginLeft: 15 }}
              href="/"
              onClick={e => this.unlikeComment(e, comment._id, loggedInUserId)}>
              <img src={unlikeIcon} alt="Like" height="17" width="17"></img>
              </Button>)
              } </a>:null
              }

              {Array.isArray(this.state.comments) &&
              this.state.comments.length ? (
                <ThreadComments id={comment._id} auth={this.props.auth} />
              ) : (
                undefined
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(ThreadComments);
