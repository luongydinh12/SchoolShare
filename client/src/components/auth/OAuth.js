
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import io from 'socket.io-client'
const socket=io("http://localhost:5050")

export default class OAuth extends Component {
  
  state = {
    user: {},
    disabled: ''
  }  

  componentDidMount() {
    const { socket } = this.props

// socket.on(provider, user => {  
//     this.popup.close()
//     this.setState({user})
//   })

this.sendSocketIO = this.sendSocketIO.bind(this);
 
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
  const { name, photo} = this.state.user
  const { disabled } = this.state
  
  return (
      <div>
          ABCDEFG
          <div>
  <button onClick={this.sendSocketIO}>Send Socket.io</button>
</div>
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
provider: PropTypes.string.isRequired,
socket: PropTypes.object.isRequired
}