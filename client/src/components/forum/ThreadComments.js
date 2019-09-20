import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Textarea, Row } from "react-materialize";

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
    console.log("ThreadComments", { state: this.state });
    if (Array.isArray(this.state.comments)) {
      if (this.state.comments.length) {
        return (
          <div>
            {this.state.comments.map(c => (
              <RenderComment key={c._id} c={c} {...this.props} />
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
      displayReplyBox: false
    };

    this.getReplies = this.getReplies.bind(this);
    this.renderPostReplyBox = this.renderPostReplyBox.bind(this);
    this.submitPostReply = this.submitPostReply.bind(this);
    this.postReplyClick = this.postReplyClick.bind(this);
    this.closeReplyClick = this.closeReplyClick.bind(this);
    this.showCommentManagement = this.showCommentManagement.bind(this);
  }

  componentDidMount = () => {
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

  postReplyClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: true });
  }
  closeReplyClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: false });
  }

  showCommentManagement(){
    if(this.props.auth.user != this.props.author) return (
      <p><a href="/" onClick={this.postReplyClick}>
      Reply
      </a></p>);
    return(
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

  render() {
    console.log("RenderComment", { state: this.state });
    const { c: comment } = this.props;

    return (
      <>
        <div className="row" style={{ marginBottom: 0 }}>
          <div className="col s12">
            <div
              className="postContent"
              style={{ boxShadow: "unset", border: "none", margin: 0 }}
            >
              <div style={{ color: "#2BB673", fontWeight: 600 }}>
                {comment.author.name}:
              </div>
              <p>{comment.content}</p>
              {this.showCommentManagement()}
              {this.renderPostReplyBox()}

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
