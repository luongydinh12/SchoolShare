import React, { Component } from 'react'
import { oAuthLogin } from "../../actions/authActions"
import { connect } from "react-redux";
import io from 'socket.io-client'

const local = "http://localhost"
// const socket = io("http://localhost:5050/")



export class OAuth extends Component {
  sendSocketIO = () => {
    const socket=this.props.socket
    socket.emit('example_message', 'demo');
    this.receiveSocketIo();
  }
  receiveSocketIo = () => {
    const socket=this.props.socket
    socket.on('google', (response) => {
      oAuthLogin(response);
      window.location.reload();
    });
    socket.on('facebook', (response) => {
      oAuthLogin(response);
      window.location.reload();
    });
  }
  startAuth = (e) => {
    this.setState({ popup: true })
    //console.log(e.target.value)
    this.openPopup(e.target.value)
  }
 
  openPopup = (provider) => {
    const socket=this.props.socket
    const width = 600, height = 600
    const left = (window.innerWidth / 2) - (width / 2)
    const top = (window.innerHeight / 2) - (height / 2)
    console.log(socket.id);
    this.sendSocketIO();
    const url = local + `:5000/api/users/${provider}?socketId=${socket.id}`
    //const url = `http://SchoolShare.me:5000/api/users/google?socketId=${socket.id}`;
    return window.open(url, '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
        height=${height}, top=${top}, left=${left}`
    )
  }

  render() {
    return (
      <div>
        <button onClick={this.startAuth}
          value={"google"}
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
    </button>
        <button onClick={this.startAuth}
          value={"facebook"}
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
    </button>
      </div>
    )
  }
}
OAuth.propTypes = {
}
export default connect(
)(OAuth);
