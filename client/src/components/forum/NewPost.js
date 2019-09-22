import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { TextInput, Textarea, Row } from "react-materialize";
import { Link } from "react-router-dom";

class NewPost extends Component {
  state = {
    title: "",
    content: "",
    loading: false,
    error: false,
    success: false,
    errorMsg: null
  };
  createNewPost = e => {
    e.preventDefault();
    this.setState({ loading: true, error: false });
    const category = this.props.location.pathname.split("/")[2];

    const data = {
      title: this.state.title,
      content: this.state.content,
      author: this.props.auth.user.id,
      category
    };
    axios
      .post("/api/posts/newforumpost", data)
      .then(result => {
        this.setState({ success: true, loading: false, name: "" });
        setTimeout(
          () => this.props.history.push("/forum/post/" + result.data.data._id),
          1500
        );
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false,
          errorMsg: err.response.data.error
        });
      });
  };

  render() {
    console.log({ auth: this.props.auth });
    let msg = null;
    if (this.state.success) {
      msg = <p className="green-text">Successfully created a new post</p>;
    }
    if (this.state.error) {
      msg = <p className="red-text">{this.state.errorMsg}</p>;
    }
    return (
      <div className="container">
        <div className="card white" style={{ padding: 5 }}>
          <h4
            className="center-text"
            style={{ marginLeft: "20px", fontFamily: "Urbana" }}
          >
            Create A New Post
          </h4>
          <div className="row">
            <div className="col l9" style={{ margin: "0 auto", float: "none" }}>
              <form onSubmit={this.createNewPost}>
                {msg}

                <div className="form-group">
                  <div className="input-field">
                    <Row>
                      <TextInput
                        label="Title"
                        value={this.state.title}
                        onChange={e => this.setState({ title: e.target.value })}
                        required
                      />
                    </Row>
                  </div>
                  <div className="input-field">
                    <Row>
                      <Textarea
                        s={12}
                        m={12}
                        l={12}
                        xl={12}
                        style={{ minHeigh: 300 }}
                        placeholder="Type your post here... "
                        value={this.state.content}
                        onChange={e =>
                          this.setState({ content: e.target.value })
                        }
                        required
                      />
                    </Row>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ margin: "0 20px" }}
                  className="btn btn-large waves-effect waves-light hoverable green accent-3"
                >
                  Post
                </button>
                <button
                  type="reset"
                  onClick={e => {
                    this.props.history.goBack();
                  }}
                  className="btn btn-large waves-effect waves-light hoverable green accent-3"
                >
                  Back
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(NewPost);
