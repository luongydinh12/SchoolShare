
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import io from 'socket.io-client'
import { timingSafeEqual } from 'crypto';
const socket = io("http://localhost:5050")
export default class OAuth extends Component {
  state = {
    user: {},
    disabled: '',
    popup:false
  }
  constructor(props){
    super(props);
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.receiveSocketIo=this.receiveSocketIo.bind(this);
    ///
    this.startAuth = this.startAuth.bind(this);
    this.openPopup=this.openPopup.bind(this);
  }
  componentDidMount() {
  //  socket.on('example_response', (response) => { console.log("in componentdidmount",response) });    
   // console.log(this);
  }

  // checkPopup() {
  //   const check = setInterval(() => {
  //     const { popup } = this
  //     if (!popup || popup.closed || popup.closed === undefined) {
  //       clearInterval(check)
  //       this.setState({ disabled: ''})
  //     }
  //   }, 1000)
  // }

  sendSocketIO() {
    socket.emit('example_message', 'demo');
    this.receiveSocketIo();
  }
  receiveSocketIo(){
    console.log(this);
    socket.on('example_response', (response) => { console.log(response) });    
  }
  startAuth(){
    console.log(this);
    this.setState({popup:true})
    this.openPopup();
  }
  openPopup(){
    console.log("open");
    //const { socket } = this.props
      const width = 600, height = 600
      const left = (window.innerWidth / 2) - (width / 2)
      const top = (window.innerHeight / 2) - (height / 2)
      console.log(socket.id);
      const url = `http://localhost:5000/api/users/google?socketId=${socket.id}`;
  
      return window.open(url, '',       
        `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
        height=${height}, top=${top}, left=${left}`
      )
  }
  

  // openPopup() {
  //   const { socket } = this.props
  //   const width = 600, height = 600
  //   const left = (window.innerWidth / 2) - (width / 2)
  //   const top = (window.innerHeight / 2) - (height / 2)
  //   const url = `http://localhost:5000/api/users/google`

  //   return window.open(url, '',       
  //     `toolbar=no, location=no, directories=no, status=no, menubar=no, 
  //     scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
  //     height=${height}, top=${top}, left=${left}`
  //   )
  // }

  // startAuth = () => {
  //   if (!this.state.disabled) {
  //     this.popup = this.openPopup()  
  //     this.checkPopup()
  //     this.setState({disabled: 'disabled'})
  //   }
  // }

  // closeCard = () => {
  //   this.setState({user: {}})
  // }

  render() {
    const { name, photo } = this.state.user
    const { disabled } = this.state

    return (
      <div>
        ABCDEFG
          <div>
          <button onClick={this.sendSocketIO}>Send Socket.io</button>
        </div>
        <button onClick={this.startAuth}></button>
      </div>
      // <div>
      //   {name
      //     ? <div className='card'> 
      //         <img src={photo} alt={name} />
      //         <FontAwesome
      //           name='times-circle'
      //           className='close'
      //           onClick={this.closeCard}
      //         />
      //         <h4>{`${atSymbol}${name}`}</h4>
      //       </div>
      //     : <div className='button-wrapper fadein-fast'>
      //         <button 
      //           onClick={this.startAuth} 
      //           className={`${provider} ${disabled} button`}
      //         >
      //         </button>
      //       </div>
      //   }
      // </div>
    )
  }
}

OAuth.propTypes = {
  // provider: PropTypes.string.isRequired,
  // socket: PropTypes.object.isRequired
}