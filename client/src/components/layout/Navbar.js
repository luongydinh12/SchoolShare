import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from './logo.png';

class Navbar extends Component {

  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper white">
            <Link
              to="/"
              style={{
                fontFamily: "Urbana"
              }}
              className="col s5 brand-logo center black-text"
            >
               {/* <i className="material-icons">code</i> */}

              <img src={logo} width="30" height="30" alt="logo " 
              style={{marginRight: "10px",}}/>
              School Share
            </Link>  

          </div>
        </nav>
      </div>
    );
  }
}
export default Navbar;
