
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import io from 'socket.io-client'
import { timingSafeEqual } from 'crypto';
const socket = io("http://localhost:5050")
export class OAuth extends Component {
  constructor(props) {
    super(props);
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.receiveSocketIo = this.receiveSocketIo.bind(this);
    this.startAuth = this.startAuth.bind(this);
    this.openPopup = this.openPopup.bind(this);
  }
  componentDidMount() {

  }

  sendSocketIO() {
    socket.emit('example_message', 'demo');
    this.receiveSocketIo();
  }
  receiveSocketIo() {
    socket.on('google', (response) => {
      console.log("jwt token:", response)
    });
  }
  startAuth() {
    console.log(this);
    this.setState({ popup: true })
    this.openPopup();
  }
  openPopup() {
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




  render() {
    return (
        <a onClick={this.startAuth}
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

    )
  }
}
export default OAuth;