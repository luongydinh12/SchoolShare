import React, { Component } from 'react'
import { oAuthLogin } from "../../actions/authActions"
import PropTypes from "prop-types";
import { connect } from "react-redux";
import io from 'socket.io-client'

const socket = io("http://localhost:5050")



export class OAuth extends Component {
  constructor() {
    super();
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.receiveSocketIo = this.receiveSocketIo.bind(this);
    this.startAuthGoogle = this.startAuthGoogle.bind(this);
    this.openPopupGoogle = this.openPopupGoogle.bind(this);
    this.startAuthFacebook = this.startAuthFacebook.bind(this);
    this.openPopupFacebook = this.openPopupFacebook.bind(this);
    this.oAuthLogin = oAuthLogin;
  }
  componentDidMount() {
    //console.log("oauth.js props: ",this.props.history.test)
  }

  sendSocketIO() {
    socket.emit('example_message', 'demo');
    this.receiveSocketIo();
  }
  receiveSocketIo() {
    socket.on('google', (response) => {
      oAuthLogin(response);
      window.location.reload();
    });
    socket.on('facebook', (response) => {
      oAuthLogin(response);
      window.location.reload();
    });
  }
  startAuthGoogle() {
    this.setState({ popup: true })
    this.openPopupGoogle();
  }
  startAuthFacebook() {
    this.setState({ popup: true })
    this.openPopupFacebook();
  }
  openPopupGoogle() {
    const width = 600, height = 600
    const left = (window.innerWidth / 2) - (width / 2)
    const top = (window.innerHeight / 2) - (height / 2)
    console.log(socket.id);
    this.sendSocketIO();
    const url = `http://localhost:5000/api/users/google?socketId=${socket.id}`;

    return window.open(url, '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
        height=${height}, top=${top}, left=${left}`
    )
  }
  openPopupFacebook() {
    const width = 600, height = 600
    const left = (window.innerWidth / 2) - (width / 2)
    const top = (window.innerHeight / 2) - (height / 2)
    console.log(socket.id);
    this.sendSocketIO();
    const url = `http://localhost:5000/api/users/facebook?socketId=${socket.id}`;

    return window.open(url, '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
        height=${height}, top=${top}, left=${left}`
    )
  }




  render() {
    return (
      <div>
        <a onClick={this.startAuthGoogle}
          style={{
            marginLeft: "0rem",
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            fontFamily: "Urbana",
            marginTop: "2rem"
          }}
          className="btn btn-large waves-effect white hoverable black-text"
        >
          Google
    </a>
        <a onClick={this.startAuthFacebook}
          style={{
            marginLeft: "2rem",
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            fontFamily: "Urbana",
            marginTop: "2rem"
          }}
          className="btn btn-large waves-effect white hoverable black-text"
        >
          Facebook
    </a>
      </div>
    )
  }
}
OAuth.propTypes = {
}
export default connect(
)(OAuth);