import {RTCPeerConnection} from 'react-native-webrtc';
import {RTCIceConnectionState} from './constants.js';
import io from 'socket.io-client';

const url = 'https://23d8cdc41b8d.ngrok.io';
const socket = io.connect(url, {transports: ['websocket']});

const join = (roomID, component, localStream, remoteStream) => {
  socket.emit('join', roomID, (socketIds) => {
    for (const i in socketIds) {
      if (socketIds.hasOwnProperty(i)) {
        const socketId = socketIds[i];
        startCall(socketId, true, component, localStream, remoteStream);
      }
    }
  });
};

const startCall = async (
  socketId,
  isOffer,
  component,
  localStream,
  remoteStream,
) => {
  // const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  const configuration = {
    iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
  };
  const localPC = new RTCPeerConnection(configuration);
  const remotePC = new RTCPeerConnection(configuration);

  /**
   * On Negotiation Needed
   */
  // localPC.onnegotiationneeded = async () => {
  //   if (isOffer) {
  //     try {
  //       const offer = await localPC.createOffer();
  //       await localPC.setLocalDescription(offer);
  //       socket.emit('exchange', {to: socketId, sdp: peer.localDescription});
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  /**
   * On Ice Candidate
   */
  localPC.onicecandidate = (e) => {
    try {
      if (e.candidate) {
        // socket.emit('exchange', {to: socketId, candidate: e.candidate});
        remotePC.addIceCandidate(e.candidate);
      } else {
        console.log('local: All ICE candidates have been sent');
      }
    } catch (err) {
      console.error(`Error adding remotePC iceCandidate: ${err}`);
    }
  };

  /**
   * On Ice Candidate
   */
  remotePC.onicecandidate = (e) => {
    try {
      if (e.candidate) {
        // socket.emit('exchange', {to: socketId, candidate: e.candidate});
        localPC.addIceCandidate(e.candidate);
      } else {
        console.log('remote: All ICE candidates have been sent');
      }
    } catch (err) {
      console.error(`Error adding localPC iceCandidate: ${err}`);
    }
  };

  /**
   * On Add Stream (Deprecated)
   */
  remotePC.onaddstream = (e) => {
    if (e.stream && remoteStream !== e.stream) {
      component.setState({remoteStream: e.stream});
    }
  };

  /**
   * Add Stream (Deprecated)
   */
  localPC.addStream(localStream);

  /**
   * On Ice Connection State Change
   */
  // localPC.oniceconnectionstatechange = (event) => {
  //   if (event.target.iceConnectionState === RTCIceConnectionState.CONNECTED) {
  //     console.log('event.target.iceConnectionState === connected');
  //   }
  //   if (event.target.iceConnectionState === RTCIceConnectionState.COMPLETED) {
  //     console.log('event.target.iceConnectionState === completed');
  //   }
  //   if (
  //     event.target.iceConnectionState === RTCIceConnectionState.FAILED ||
  //     event.target.iceConnectionState === RTCIceConnectionState.DISCONNECTED ||
  //     event.target.iceConnectionState === RTCIceConnectionState.CLOSED
  //   ) {
  //     console.log('RTCIceConnectionState error');
  //   }
  // };

  try {
    const offer = await localPC.createOffer();

    await localPC.setLocalDescription(offer);

    await remotePC.setRemoteDescription(localPC.localDescription);

    const answer = await remotePC.createAnswer();

    await remotePC.setLocalDescription(answer);

    await localPC.setRemoteDescription(remotePC.localDescription);
  } catch (err) {
    console.error(err);
  }
  component.setState({cachedLocalPC: localPC});
  component.setState({cachedRemotePC: remotePC});
};

export {startCall, join};
