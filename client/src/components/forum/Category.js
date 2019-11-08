import { TextInput, Row, Select, Pagination, ProgressBar} from 'react-materialize';
import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: null,
      page: 1,
      totalPosts: 0,
      totalPages: 0,
      loading: true,
      error: false,
      currentSearch: "",
      searchOption: 1,
    };

    this.getPosts = this.getPosts.bind(this);
  }

  componentDidMount = () => {
    this.getPosts();
  };

  getPosts(searchTerm,searchOption = 1, _page = undefined) {
    this.setState({ loading: true });

    const id = this.props.location.pathname.split("/")[2];
    const page = _page ? _page : this.state.page;
    axios
      .get(
        (!searchTerm || searchTerm === "")?
        encodeURI("/api/posts/getpostsforcat?catId=" + id + "&page=" + page)
        : encodeURI("/api/posts/getpostsforcat?catId=" + id + "&page=" + page +"&searchoption="+searchOption+"&search=" + searchTerm)
        )
      .then(({ data }) => {
        this.setState({ ...data, loading: false, error: false });
      })
      .catch(err => {
        this.setState({ loading: false, error: true });
      });
  }

  render() {
    console.log(this.props.match);

    let postList = <h4>Loading...</h4>;

    const { posts, totalPosts, totalPages, loading, error } = this.state;
    if (posts && totalPosts) {
      postList = posts.map(p => {
        return (
          <div className="forumThread" key={p._id}>
            <Link to={"/forum/post/" + p._id}>{p.title}</Link>
            <p>{(p.author)?p.author.name:"[deleted]"}</p>
          </div>
        );
      });
    }
    if (error) {
      postList = <h4>an error occured...</h4>;
    }
    if (totalPosts === 0) {
      postList = <h4>No posts found in this category.</h4>;
    }
    if (loading) {
      postList = <ProgressBar/>;
    }
    return (
      <div className="container">
        <div className="card white" style={{ padding: 5 }}>
          <div className="col">
            <div className="col 18">
              <h4
                className="center-text"
                style={{
                  fontFamily: "Urbana",
                  marginLeft: "15px"
                }}
              >
                Discussion Forum
              </h4>
            </div>
            <div className="col 14">
              <a
                href="/"
                onClick={e => {
                  e.preventDefault();
                  this.props.history.goBack();
                }}
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
                style={{
                  width: "160px",
                  borderRadius: "1px",
                  marginTop: "3rem",
                  marginLeft: "1rem",
                  marginBottom: "2rem"
                }}
              >
                Go Back
              </a>
              <Link
                to={this.props.match.url + "/new"}
                className="btn btn-large waves-effect waves-light hoverable green accent-3"
                style={{
                  width: "160px",
                  borderRadius: "1px",
                  marginTop: "3rem",
                  marginLeft: "1rem",
                  marginBottom: "2rem"
                }}
              >
                Create Post
              </Link>
            </div>
          </div>
          <div className="row" style={{display: "inline", verticalAlign:"middle"}}>
          <Row style={{ boxShadow: "0px 0px 1px 0px darkseagreen" }}>
            <TextInput
              s={10}
             m={10}
             l={10}
             xl={10}
             className="searchBar"
             placeholder={"Search"}
             value={this.state.currentSearch}
             onChange={e => {this.setState({ currentSearch: e.target.value, page: 1}); 
                 this.getPosts(e.target.value, this.state.searchOption, 1)}}
               />
            <Select 
              name="searchOptions"
              onChange = {e => {this.setState({searchOption: e.target.value, page: 1}); this.getPosts(this.state.currentSearch, e.target.value, 1)}}>
                  <option value="1">
                    Search by Title
                  </option>
                  <option value="2">
                    Search by Author
                  </option>
              </Select>
            </Row>
            <div className="col s12" style={{ marginTop: "2rem" }}>
              {postList}
            </div>
          </div>
          {this.state.totalPages && !this.state.error ? (
            <Pagination className="pageList"
              activePage={this.state.page}
              items={this.state.totalPages}
              maxButtons={5}
              onSelect = {e =>
                {this.setState({page: e});
                  console.log(this.state.totalPosts);
                 this.getPosts(this.state.currentSearch, this.state.searchOption, e)}
              }
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Category;
