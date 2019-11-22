import axios from 'axios';
import React, { Component } from 'react';
import { Row, Textarea, ProgressBar } from 'react-materialize';
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
      authorHandle: "",
      displayReplyBox: false,
      displayEditTitle: false,
      displayEditDesc: false,
      displayDeleteConfirm: false
    };

  }

  componentDidMount = () => {
    this.getPost();
  };

  getPost=()=>{
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
        this.hasProfile(this.state.post);
      })
      .catch(err => {
        console.log({ err });
        this.setState({ loading: false, error: true });
      });
  }

  hasProfile=(post)=> {
    axios.get("/api/profile/user/"+post.author._id)
        .then(({data}) => {this.setState({authorHandle: data.handle})})
        .catch(err => {
          this.setState({authorHandle: ""});
        });
  }

  renderPost=(post)=> { 
    return (
      <>
        <div className="postContent">
          <p style={{ color: "#2BB673", fontWeight: 600 }}>
            {(post.author)?
                ((this.state.authorHandle)?
                  <a style={{ color: "#2BB673", fontWeight: 600 }} href={"/profile/"+this.state.authorHandle}>{post.author.name}</a>:
                  post.author.name)
                :"[deleted]"}
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

  renderSave(post){
    return(
      <>
          <div>
          {!post.saves.find(user => user._id === this.props.auth.user.id) ? (
                <h6
                  style={{ color: "rgb(44, 127, 252)" }}
                  href="/"
                  onClick={e => this.savePost(e, post)}>
                 Save
                </h6>
              ) : <h6 style={{ color: "rgb(44, 127, 252)" }}
                   href="/"
                   onClick={e => this.unsavePost(e, post)}>
                   UnSave
                  </h6> }
          </div> 
          </>
    );
  }
  savePost = (e, post) => {
    e.preventDefault();
    const userId = this.props.auth.user.id;
    const postId = post._id;
    
    const data = {
      postId: postId,
      userId: userId
    }

    axios
    .post('/api/posts/saveThread', data)
    .then(res => {
      this.getPost();
  })
  }

  unsavePost = (e, post) => {
    e.preventDefault();
    const userId = this.props.auth.user.id;
    const postId = post._id;
    
    const data = {
      postId: postId,
      userId: userId
    }

    axios
    .post('/api/posts/unsaveThread', data)
    .then(res => {
      this.getPost();
  })
  }

  renderPostReplyBox=()=> {
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

  submitPostReply=(e)=> {
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
  
  renderEditTitleBox=()=> {
    if (!this.state.displayEditTitle) return undefined;
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

  submitPostEditTitle=(e)=> {
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
        var p=this.state.post
        p.title=this.state.postReplyValue
        this.setState({post:p})
        //this.state.post.title = this.state.postReplyValue;
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

  renderEditDescBox=()=> {
    if (!this.state.displayEditDesc) return undefined;
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

  submitPostEditDesc=(e)=> {
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
        var p=this.state.post
        p.content=this.state.postReplyValue
        this.setState({post:p})
       // this.state.post.content = this.state.postReplyValue;
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

  renderDeleteConfirmation=()=> {
    if (!this.state.displayDeleteConfirm) return undefined;
    if (this.state.postingDelete) {
      return (
        <ProgressBar/>
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

  submitPostDelete=(e)=> {
    e.preventDefault();
    this.setState({ postingReply: true });
    console.log({ state: this.state });

    const thread = this.props.location.pathname.split("/")[3];
    axios
      .post("/api/posts/deleteThread", {
        id: thread
      })
      .then(({ data }) => {
        var p=this.state.post
        p.deleted=true
        this.setState({post:p})
//        this.state.post.deleted = true;
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

  postReplyClick=(e)=> {
    e.preventDefault();
    this.setState({ displayReplyBox: true, displayEditTitle: false, displayEditDesc: false, displayDeleteConfirm: false, postReplyValue: ""});
  }
  editTitleClick(e) {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayEditTitle: true, displayEditDesc: false, displayDeleteConfirm: false, postReplyValue: this.state.post.title});
  }
  editDescClick=(e)=> {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayEditTitle: false, displayEditDesc: true, displayDeleteConfirm: false, postReplyValue: this.state.post.content});
  }
  postDeleteClick=(e)=> {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayEditTitle: false, displayEditDesc: false, displayDeleteConfirm: true});
  }
  closeAll=(e)=> {
    e.preventDefault();
    this.setState({ displayReplyBox: false, displayEditTitle: false, displayEditDesc: false, displayDeleteConfirm: false});
  }
  showCommentManagement=(post)=> {
    if((this.props.auth.user.id !== post.author._id) || post.deleted) return (
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

  render() {
    console.log(this.props.match);
    const id = this.props.location.pathname.split("/")[3];

    let postHTML = <h4>Loading...</h4>;
    let renderSave = <h4> </h4>;
    const { post, loading, error } = this.state;
    if (post) {
      postHTML = this.renderPost(post);
      renderSave = this.renderSave(post);
    }
    if (error) {
      postHTML = <h4>an error occured...</h4>;
    }
    if (loading) {
      postHTML = <ProgressBar/>;
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
            <p style={{
                  marginTop: "3rem",
                  marginLeft: "30px"
                }} >{renderSave}</p>
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