'use strict'
import React, { Component } from 'react'
import adapter from 'webrtc-adapter';

class WebRTC extends Component {
    state = {
        connections: {},
        room: 'abcdefg'
    }
    socket = this.props.socket
    localStream = null
    remoteStream = null
    iceConfig = {}
    RTCOfferOptions = {
        'OfferToRecieveAudio': true
    }
    getUserMediaOptions = {
        audio: true
    }
    _joinCall = () => {
        navigator.mediaDevices.getUserMedia(this.getUserMediaOptions)
            .then((mediaStream) => {
                console.log('getusermedia mediastream', mediaStream)
                this.localStream = mediaStream
            })
            .then(() => {
                this.remoteStream = new MediaStream()
                this.remoteStream.onaddtrack=(e)=>{
                    console.log('remotestream add track tracks:',this.remoteStream.getTracks())
                }
                document.getElementById('audio').srcObject=this.remoteStream
            })
            .then(() => this._sendJoin())
    }
    _sendJoin = () => {
        this.socket.emit('join', { room: this.state.room, profile: this.props.profile.profile })
    }
    _handleMessage = (data) => {
        //{ sender: sender, msgType: msgType, msg: msg }
        const { sender, msgType, msg } = data
        var pc = this._getPeerConnection(sender)
        console.log('_handlemessage sender:', sender, 'pc:', pc)
        switch (msgType) {
            case 'ice':
                console.log('Adding new ICE candidates', data)
                pc.addIceCandidate(new RTCIceCandidate(msg))
                break
            case 'sdp-offer':
                pc.setRemoteDescription(new RTCSessionDescription(msg), () => {
                    console.log('Setting remote description by offer')
                    pc.createAnswer().then((sdp) => {
                        pc.setLocalDescription(sdp)
                        this.socket.emit('relayMsg',
                            {
                                sender: this.socket.id,
                                recipient: sender,
                                msgType: 'sdp-answer',
                                msg: sdp
                            })
                    })
                }) //pc.setRemoteDescription
                break
            case 'sdp-answer':
                pc.setRemoteDescription(new RTCSessionDescription(msg),
                    () => { console.log('Setting remote description by answer') },
                    (e) => {
                        console.error(e)
                    })
                break
            default:
                console.log('msgType:', msgType)

        }

    }
    _makeOffer = (recipientId) => {
        var pc = this._getPeerConnection(recipientId)
        pc.createOffer(this.RTCOfferOptions).then((sdp) => {
            pc.setLocalDescription(sdp)
            console.log(`Creating offer for ${recipientId}`)
            this.socket.emit('relayMsg', {
                sender: this.socket.id,
                recipient: recipientId,
                msgType: 'sdp-offer',
                msg: sdp
            })
        }, (e) => {
            console.log('makeOffer', e)
        }, { mandatory: this.RTCOfferOptions })

    }
    _getPeerConnection(recipientId) {
        console.log(`getPeerConnection ${recipientId}`, this.state.connections[recipientId])
        let pc
        if (this.state.connections[recipientId].peerConnection) pc = this.state.connections[recipientId].peerConnection
        else {
            console.log('create rtcpeerconnection')
            pc = new RTCPeerConnection(this.iceConfig)

            this.localStream.getTracks().forEach((track) => {
                console.log('add track', track)
                pc.addTrack(track, this.localStream)
            })
   
            pc.onicecandidate = (e) => {
                console.log('onicecandidate', e)
                if (e.candidate) {
                    this.socket.emit('relayMsg', {
                        recipient: recipientId,
                        sender: this.socket.id,
                        msgType: 'ice',
                        msg: e.candidate
                    })
                }
            }
           
            pc.ontrack = (e) => {
                this.remoteStream.addTrack(e.track)
                console.log('added track: ', this.remoteStream.getTracks())
                console.log('added track: ', this.remoteStream.onaddtrack)

            }

            const c = this.state.connections
            c[recipientId].peerConnection = pc
            this.setState({ connections: c })

            console.log('_getPeerConnection id:', recipientId, 'pc:', pc)
        }
        return pc
    }

    componentDidMount() {
        this.socket.on('onlinelist', (data) => {
            console.log('voice online list: ', data)
            this.setState({ connections: data })
        })
        this.socket.on('userDisconnect', (socketId) => {
            console.log('user disconnect: ', socketId)
            const { connections: { [socketId]: deletedValue, ...connections } } = this.state
            this.setState({ connections: connections })
        })
        this.socket.on('userConnect', (data) => {
            console.log('user connect:', data)
            var { connections } = this.state
            connections[data.socketId] = { profile: data.profile.profile }
            console.log(connections)
            this.setState({ connections: connections })
            this._makeOffer(data.socketId)
        })
        this.socket.on('relayMsg', this._handleMessage)
    }
    render() {
        return (
            <div className="container" style={{ marginBottom: "20px" }}>
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text">WebRTC Test {this.socket.id} </h4>
                    <audio id='audio' //style={{ display: 'none' }} 
                    controls
                    autoPlay={true} 
                    //src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg" 
                    />
                    <div className="btn-small waves-effect waves-light hoverable" onClick={this._joinCall}>
                        Join Call
                    </div>

                </div>
            </div>)
    }
}
export default WebRTC