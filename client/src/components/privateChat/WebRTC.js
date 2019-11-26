'use strict'
import React, { Component } from 'react'

class WebRTC extends Component {
    state = {
        connections: {},
        room: 'abcdefg'
    }
    socket = this.props.socket
    startTime = null
    localVideo = null
    remoteVideo = null
    startButton = null
    callButton = null
    hangupButton = null

    iceConfig = {}
    RTCOfferOptions = {
        offerToReceiveVideo: true,
        offerToRecieveAudio: true
    }
    getUserMediaOptions = {
        audio: true
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
                console.log('Adding new ICE candidates')
                pc.addIceCandidate(new RTCIceCandidate(msg))
                break
            case 'sdp-offer':
                pc.setRemoteDescription(new RTCSessionDescription(msg), () => {
                    console.log('Setting remote description by offer')
                    pc.createAnswer(this.RTCOfferOptions).then((sdp) => {
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

    // Handles remote MediaStream success by adding it as the remoteVideo src.
    gotRemoteMediaStream = (event) => {
        const mediaStream = event.stream;
        this.remoteVideo.srcObject = mediaStream;
        this.remoteStream = mediaStream;
        this.trace('Remote peer connection received remote stream.');
    }
    trace = (text) => {
        text = text.trim();
        const now = (window.performance.now() / 1000).toFixed(3);

        console.log(now, text);
    }
    // Handles start button action: creates local MediaStream.
    startAction = () => {
        this.startButton.disabled = true;
        navigator.mediaDevices.getUserMedia(this.getUserMediaOptions)
            .then((mediaStream) => {
                console.log(`gotlocalmediastream: `, mediaStream)
                this.localVideo.srcObject = mediaStream;
                this.localStream = mediaStream;
                this.trace('Received local stream.');
                this.callButton.disabled = false;  // Enable call button.
            }).catch((error) => {
                this.trace(`navigator.getUserMedia error: ${error.toString()}.`);
            });
        this.trace('Requesting local stream.');
    }
    // Handles hangup action: ends up call, closes connections and resets peers.
    hangupAction = () => {
        this.localPeerConnection.close();
        this.remotePeerConnection.close();
        this.localPeerConnection = null;
        this.remotePeerConnection = null;
        this.hangupButton.disabled = true;
        this.callButton.disabled = false;
        this.trace('Ending call.');
    }
    // Connects with new peer candidate.
    handleConnection = (event) => {
        const peerConnection = event.target;
        const iceCandidate = event.candidate;

        if (iceCandidate) {
            const newIceCandidate = new RTCIceCandidate(iceCandidate);// Gets the "other" peer connection.
            const otherPeer = (peerConnection === this.localPeerConnection) ?
                this.remotePeerConnection : this.localPeerConnection;

            otherPeer.addIceCandidate(newIceCandidate)
                .then(() => {
                    this.trace(`${this.getPeerName(peerConnection)} addIceCandidate success.`);
                }).catch((error) => {
                    this.trace(`${this.getPeerName(peerConnection)} failed to add ICE Candidate:\n` +
                        `${error.toString()}.`);
                });

            this.trace(`${this.getPeerName(peerConnection)} ICE candidate:\n` +
                `${event.candidate.candidate}.`);
        }
    }
    // Gets the name of a certain peer connection.
    getPeerName = (peerConnection) => {
        return (peerConnection === this.localPeerConnection) ?
            'localPeerConnection' : 'remotePeerConnection';
    }
    // Logs changes to the connection state.
    handleConnectionChange = (event) => {
        const peerConnection = event.target;
        console.log('ICE state change event: ', event);
        this.trace(`${this.getPeerName(peerConnection)} ICE state: ` +
            `${peerConnection.iceConnectionState}.`);
    }
    // Handles call button action: creates peer connection.
    callAction = () => {
        // Logs error when setting session description fails.
        const setSessionDescriptionError = (error) => {
            this.trace(`Failed to create session description: ${error.toString()}.`);
        }

        // Logs success when setting session description.
        const setDescriptionSuccess = (peerConnection, functionName) => {
            const peerName = this.getPeerName(peerConnection);
            this.trace(`${peerName} ${functionName} complete.`);
        }

        this.callButton.disabled = true;
        this.hangupButton.disabled = false;

        //console.log('callAction: localstream: ', localStream)
        this.trace('Starting call.');
        this.startTime = window.performance.now();

        // Get local media stream tracks.
        const videoTracks = this.localStream.getVideoTracks();
        const audioTracks = this.localStream.getAudioTracks();
        if (videoTracks.length > 0) {
            this.trace(`Using video device: ${videoTracks[0].label}.`);
        }
        if (audioTracks.length > 0) {
            this.trace(`Using audio device: ${audioTracks[0].label}.`);
        }

        const servers = null;  // Allows for RTC server configuration.

        // Create peer connections and add behavior.
        this.localPeerConnection = new RTCPeerConnection(servers);
        this.trace('Created local peer connection object localPeerConnection.');

        this.localPeerConnection.addEventListener('icecandidate', this.handleConnection);
        this.localPeerConnection.addEventListener(
            'iceconnectionstatechange', this.handleConnectionChange);

        this.remotePeerConnection = new RTCPeerConnection(servers);
        this.trace('Created remote peer connection object remotePeerConnection.');

        this.remotePeerConnection.addEventListener('icecandidate', this.handleConnection);
        this.remotePeerConnection.addEventListener(
            'iceconnectionstatechange', this.handleConnectionChange);
        this.remotePeerConnection.addEventListener('addstream', this.gotRemoteMediaStream);

        // Add local stream to connection and create offer to connect.
        this.localPeerConnection.addStream(this.localStream);
        this.trace('Added local stream to localPeerConnection.');

        this.trace('localPeerConnection createOffer start.');
        this.localPeerConnection.createOffer({
            offerToReceiveVideo: 1,
        })
            .then((description) => {        // Logs offer creation and sets peer connection session descriptions.
                this.trace(`Offer from localPeerConnection:\n${description}`);

                this.trace('localPeerConnection setLocalDescription start.');
                this.localPeerConnection.setLocalDescription(description)
                    .then(() => {
                        setDescriptionSuccess(this.localPeerConnection, 'setLocalDescription');
                    }).catch(setSessionDescriptionError);
                //this is where you'd do the signalling?

                this.socket.emit('sendLocalDescription', description)
                this._sendJoin()
                this.socket.emit('relayMsg', { recipient: 'abc', room: 'abcdefg', msgType: 'test', msg: 'testmsg' })

                // this.sendLocalDescription(description)
                this.socket.on('remoteDescription', (remoteDescription) => {
                    this.trace('remotePeerConnection setRemoteDescription start.');
                    this.remotePeerConnection.setRemoteDescription(description)
                        .then(() => {
                            setDescriptionSuccess(this.remotePeerConnection, 'setRemoteDescription');
                        }).catch(setSessionDescriptionError);



                    this.trace('remotePeerConnection createAnswer start.');
                    this.remotePeerConnection.createAnswer()
                        .then(  // Logs answer to offer creation and sets peer connection session descriptions.
                            (description) => {
                                this.trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

                                this.trace('remotePeerConnection setLocalDescription start.');
                                this.remotePeerConnection.setLocalDescription(description)
                                    .then(() => {
                                        setDescriptionSuccess(this.remotePeerConnection, 'setLocalDescription');
                                    }).catch(setSessionDescriptionError);

                                this.trace('localPeerConnection setRemoteDescription start.');
                                this.localPeerConnection.setRemoteDescription(description)
                                    .then(() => {
                                        setDescriptionSuccess(this.localPeerConnection, 'setRemoteDescription');
                                    }).catch(setSessionDescriptionError);
                            }
                        )
                        .catch(setSessionDescriptionError);
                })


            }).catch(setSessionDescriptionError);
    }
    _makeOffer = (recipientId) => {
        var pc = this._getPeerConnection(recipientId)
        pc.createOffer((sdp) => {
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
            const c = this.state.connections[recipientId]
            this.state.connections[recipientId].peerConnection = pc
            this.setState({ connnections: c })

            navigator.mediaDevices.getUserMedia({
                audio: true
            })
                .then((mediaStream) => {
                    pc.addStream(mediaStream)
                })
            // pc.addStream(this.localStream)
            pc.onicecandidate = (e) => {
                console.log('onicecandidate')
                this.socket.emit('relayMsg', {
                    recipient: recipientId,
                    sender: this.socket.id,
                    msgType: 'ice',
                    msg: e.candidate
                })
            }
            pc.onaddstream = (e) => {
                console.log('recieved new stream, e:', e)
                ///###############
            }
            console.log('_getPeerConnection id:', recipientId, 'pc:', pc)
        }
        return pc
    }
    componentDidMount() {
        this.startButton = document.getElementById('startButton');
        this.callButton = document.getElementById('callButton');
        this.hangupButton = document.getElementById('hangupButton');
        this.localVideo = document.getElementById('localVideo')
        this.remoteVideo = document.getElementById('remoteVideo')

        let localStream;
        let remoteStream;

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
        // Logs a message with the id and size of a video element.
        function logVideoLoaded(event) {
            const video = event.target;
            trace(`${video.id} videoWidth: ${video.videoWidth}px, ` +
                `videoHeight: ${video.videoHeight}px.`);
        }

        // Logs a message with the id and size of a video element.
        // This event is fired when video begins streaming.
        function logResizedVideo(event) {
            logVideoLoaded(event);

            if (this.startTime) {
                const elapsedTime = window.performance.now() - this.startTime;
                this.startTime = null;
                trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
            }
        }

        this.localVideo.addEventListener('loadedmetadata', logVideoLoaded);
        this.remoteVideo.addEventListener('loadedmetadata', logVideoLoaded);
        this.remoteVideo.addEventListener('onresize', logResizedVideo);
        this.callButton.disabled = true;
        this.hangupButton.disabled = true;

        // Add click event handlers for buttons.
        this.startButton.addEventListener('click', this.startAction);
        this.callButton.addEventListener('click', this.callAction);
        this.hangupButton.addEventListener('click', this.hangupAction);

        // Logs an action (text) and the time when it happened on the console.
        function trace(text) {
            text = text.trim();
            const now = (window.performance.now() / 1000).toFixed(3);

            console.log(now, text);
        }

    }
    render() {
        return (
            <div className="container" style={{ marginBottom: "20px" }}>
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text">WebRTC Test {this.socket.id} </h4>

                    <video id="localVideo" autoPlay playsInline></video>
                    <video id="remoteVideo" autoPlay playsInline></video>

                    <div>
                        <button id="startButton">Start</button>
                        <button id="callButton">Call</button>
                        <button id="hangupButton">Hang Up</button>
                    </div>


                    <div className="btn-small waves-effect waves-light hoverable" onClick={this._sendJoin}>
                        Join Call
                    </div>
                    
                </div>
            </div>)
    }
}
export default WebRTC