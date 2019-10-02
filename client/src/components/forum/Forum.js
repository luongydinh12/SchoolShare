import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Categories from "./Categories";
import Category from "./Category";
import { Link } from "react-router-dom";
import NewPost from "./NewPost";
import ViewPost from "./ViewPost";

class Forum extends Component {
  render() {
    console.log(this.props.match);
    return (
      <div>
        <div className="container" style={{}}>
          <Link
            to="/dashboard"
            className="btn btn-large waves-effect waves-light hoverable green accent-3"
            style={{
              width: "220px",
              borderRadius: "1px",
              marginTop: "3rem",
              marginBottom: "2rem"
            }}
          >
            Back to  E
          </Link>
        </div>
        
        <p style={{ padding: "1px" }} />
        <Fragment>
          <Switch>
            <Route exact={true} path={"/forum/post/:id"} component={ViewPost} />
            <Route path={"/forum/:cat/new"} component={NewPost} />
            <Route path={"/forum/:cat"} component={Category} />
            <Route path="/forum" component={Categories} />
          </Switch>
        </Fragment>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Forum);
