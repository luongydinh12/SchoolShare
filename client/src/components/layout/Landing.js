import React, { Component } from "react";
import { Link } from "react-router-dom";
class Landing extends Component {
  componentDidMount() {
    document.body.classList.remove("background-white");
}
  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <div>
              <span style={{ fontFamily: "Urbana",
                             color: "#ffffff",
                             fontSize: "125px" }}>School Share.</span>
            </div>
            <h3>
              <span style={{
                fontFamily: "Urbana",
                color: "#fffff0"
                }}>Collaborate with Classmates online.</span>
            </h3>
            <br />
            <a href="/register"
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                fontFamily: "Urbana",
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              Register
            </a>
            <a href="/login"
              style={{
                marginLeft: "2rem",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                fontFamily: "Urbana",
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              Log In
            </a>
            <a href="http://localhost:5000/api/users/google"
              style={{
                marginLeft: "2rem",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                fontFamily: "Urbana",
              }}
              className="btn btn-large waves-effect white hoverable black-text"
            >
              Google
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;
