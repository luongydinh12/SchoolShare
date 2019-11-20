'use strict'
import React, { Component } from 'react'

class WebRTC extends Component {
    componentDidMount() {
        const socket = this.props.io('http://localhost:5050/voiceChat')

        // Set up media stream constant and parameters.

        // In this codelab, you will be streaming video only: "video: true".
        // Audio will not be streamed because it is set to "audio: false" by default.



        // Define initial start time of the call (defined as connection between peers).
        let startTime = null;

        // Define peer connections, streams and video elements.
        const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');

        let localStream;
        let remoteStream;

        let localPeerConnection;
        let remotePeerConnection;

        // Handles remote MediaStream success by adding it as the remoteVideo src.
        function gotRemoteMediaStream(event) {
            const mediaStream = event.stream;
            remoteVideo.srcObject = mediaStream;
            remoteStream = mediaStream;
            trace('Remote peer connection received remote stream.');
        }


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

            if (startTime) {
                const elapsedTime = window.performance.now() - startTime;
                startTime = null;
                trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
            }
        }

        localVideo.addEventListener('loadedmetadata', logVideoLoaded);
        remoteVideo.addEventListener('loadedmetadata', logVideoLoaded);
        remoteVideo.addEventListener('onresize', logResizedVideo);


        // Define RTC peer connection behavior.

        // Connects with new peer candidate.
        function handleConnection(event) {
            const peerConnection = event.target;
            const iceCandidate = event.candidate;

            if (iceCandidate) {
                const newIceCandidate = new RTCIceCandidate(iceCandidate);// Gets the "other" peer connection.
                const otherPeer = (peerConnection === localPeerConnection) ?
                    remotePeerConnection : localPeerConnection;

                otherPeer.addIceCandidate(newIceCandidate)
                    .then(() => {
                        trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
                    }).catch((error) => {
                        trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n` +
                            `${error.toString()}.`);
                    });

                trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
                    `${event.candidate.candidate}.`);
            }
        }


        // Logs changes to the connection state.
        function handleConnectionChange(event) {
            const peerConnection = event.target;
            console.log('ICE state change event: ', event);
            trace(`${getPeerName(peerConnection)} ICE state: ` +
                `${peerConnection.iceConnectionState}.`);
        }

        // Logs error when setting session description fails.
        function setSessionDescriptionError(error) {
            trace(`Failed to create session description: ${error.toString()}.`);
        }

        // Logs success when setting session description.
        function setDescriptionSuccess(peerConnection, functionName) {
            const peerName = getPeerName(peerConnection);
            trace(`${peerName} ${functionName} complete.`);
        }




        // Define and add behavior to buttons.

        // Define action buttons.
        const startButton = document.getElementById('startButton');
        const callButton = document.getElementById('callButton');
        const hangupButton = document.getElementById('hangupButton');

        // Set up initial action buttons status: disable call and hangup.
        callButton.disabled = true;
        hangupButton.disabled = true;


        // Handles start button action: creates local MediaStream.
        function startAction() {
            startButton.disabled = true;
            navigator.mediaDevices.getUserMedia({
                audio: true
            })
                .then((mediaStream) => {
                    console.log(`gotlocalmediastream: `, mediaStream)
                    localVideo.srcObject = mediaStream;
                    localStream = mediaStream;
                    trace('Received local stream.');
                    callButton.disabled = false;  // Enable call button.
                }).catch((error) => {
                    trace(`navigator.getUserMedia error: ${error.toString()}.`);
                });
            trace('Requesting local stream.');
        }

        // Handles call button action: creates peer connection.
        function callAction() {
            callButton.disabled = true;
            hangupButton.disabled = false;

            //console.log('callAction: localstream: ', localStream)
            trace('Starting call.');
            startTime = window.performance.now();

            // Get local media stream tracks.
            const videoTracks = localStream.getVideoTracks();
            const audioTracks = localStream.getAudioTracks();
            if (videoTracks.length > 0) {
                trace(`Using video device: ${videoTracks[0].label}.`);
            }
            if (audioTracks.length > 0) {
                trace(`Using audio device: ${audioTracks[0].label}.`);
            }

            const servers = null;  // Allows for RTC server configuration.

            // Create peer connections and add behavior.
            localPeerConnection = new RTCPeerConnection(servers);
            trace('Created local peer connection object localPeerConnection.');

            localPeerConnection.addEventListener('icecandidate', handleConnection);
            localPeerConnection.addEventListener(
                'iceconnectionstatechange', handleConnectionChange);

            remotePeerConnection = new RTCPeerConnection(servers);
            trace('Created remote peer connection object remotePeerConnection.');

            remotePeerConnection.addEventListener('icecandidate', handleConnection);
            remotePeerConnection.addEventListener(
                'iceconnectionstatechange', handleConnectionChange);
            remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

            // Add local stream to connection and create offer to connect.
            localPeerConnection.addStream(localStream);
            trace('Added local stream to localPeerConnection.');

            trace('localPeerConnection createOffer start.');
            localPeerConnection.createOffer({
                offerToReceiveVideo: 1,
            })
                .then((description) => {        // Logs offer creation and sets peer connection session descriptions.
                    trace(`Offer from localPeerConnection:\n${description}`);

                    trace('localPeerConnection setLocalDescription start.');
                    localPeerConnection.setLocalDescription(description)
                        .then(() => {
                            setDescriptionSuccess(localPeerConnection, 'setLocalDescription');
                        }).catch(setSessionDescriptionError);
                    //this is where you'd do the signalling?

                    socket.emit('sendLocalDescription', description)
                    socket.on('remoteDescription', (remoteDescription) => {
                        trace('remotePeerConnection setRemoteDescription start.');
                        remotePeerConnection.setRemoteDescription(description)
                            .then(() => {
                                setDescriptionSuccess(remotePeerConnection, 'setRemoteDescription');
                            }).catch(setSessionDescriptionError);



                        trace('remotePeerConnection createAnswer start.');
                        remotePeerConnection.createAnswer()
                            .then(  // Logs answer to offer creation and sets peer connection session descriptions.
                                (description) => {
                                    trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

                                    trace('remotePeerConnection setLocalDescription start.');
                                    remotePeerConnection.setLocalDescription(description)
                                        .then(() => {
                                            setDescriptionSuccess(remotePeerConnection, 'setLocalDescription');
                                        }).catch(setSessionDescriptionError);

                                    trace('localPeerConnection setRemoteDescription start.');
                                    localPeerConnection.setRemoteDescription(description)
                                        .then(() => {
                                            setDescriptionSuccess(localPeerConnection, 'setRemoteDescription');
                                        }).catch(setSessionDescriptionError);
                                }
                            )
                            .catch(setSessionDescriptionError);
                    })


                }).catch(setSessionDescriptionError);
        }

        // Handles hangup action: ends up call, closes connections and resets peers.
        function hangupAction() {
            localPeerConnection.close();
            remotePeerConnection.close();
            localPeerConnection = null;
            remotePeerConnection = null;
            hangupButton.disabled = true;
            callButton.disabled = false;
            trace('Ending call.');
        }

        // Add click event handlers for buttons.
        startButton.addEventListener('click', startAction);
        callButton.addEventListener('click', callAction);
        hangupButton.addEventListener('click', hangupAction);




        // Gets the name of a certain peer connection.
        function getPeerName(peerConnection) {
            return (peerConnection === localPeerConnection) ?
                'localPeerConnection' : 'remotePeerConnection';
        }

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
                    <h4 className="center-text">WebRTC Test</h4>

                    <video id="localVideo" autoPlay playsInline></video>
                    <video id="remoteVideo" autoPlay playsInline></video>

                    <div>
                        <button id="startButton">Start</button>
                        <button id="callButton">Call</button>
                        <button id="hangupButton">Hang Up</button>
                    </div>
                </div>
            </div>)
    }
}
export default WebRTC