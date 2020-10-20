import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import {RTCIceConnectionState} from './constants.js';

let pcPeers = {};

const exchange = async (data, socket) => {
  let fromId = data.from;

  let pc;
  if (fromId in data.component.pcPeers) {
    pc = data.component.pcPeers[fromId];
  } else {
    pc = startCall(
      fromId,
      false,
      data.component,
      data.component.localStream,
      data.component.remoteStream,
    );
  }

  if (data.sdp) {
    let sdp = new RTCSessionDescription(data.sdp);

    await pc.setRemoteDescription(sdp);

    if (pc.remoteDescription.type === 'offer') {
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('exchange', {
        to: fromId,
        sdp: pc.localDescription,
      });
    }
  } else {
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
};

// const leave = (socketId) => {
//   const pc = pcPeers[socketId];
//   pc.close();

//   delete pcPeers[socketId];

//   const remoteList = compenent.state.remoteList;

//   delete remoteList[socketId];

//   compenent.setState({
//     info: 'One peer left!',
//     remoteList: remoteList,
//   });
// };

const join = (roomID, component, localStream, remoteStream, socket) => {
  socket.emit('join', roomID, (socketIds) => {
    for (const i in socketIds) {
      if (socketIds.hasOwnProperty(i)) {
        const socketId = socketIds[i];
        startCall(socketId, true, component, localStream, remoteStream, socket);
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
  socket,
) => {
  // const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  const configuration = {
    iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
  };
  const pc = new RTCPeerConnection(configuration);

  component.setState((prevState) => {
    return {
      ...prevState,
      pcPeers: {
        ...prevState.pcPeers,
        [socketId]: pc,
      },
    };
  });

  pcPeers = {
    ...pcPeers,
    [socketId]: pc,
  };

  /**
   * On Negotiation Needed
   */
  pc.onnegotiationneeded = async () => {
    if (isOffer) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('exchange', {
          to: socketId,
          sdp: pc.localDescription,
          component: component,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   * On Ice Candidate
   */
  pc.onicecandidate = (e) => {
    try {
      if (e.candidate) {
        socket.emit('exchange', {
          to: socketId,
          candidate: e.candidate,
          component: component,
        });
      } else {
        console.log('All ICE candidates have been sent');
      }
    } catch (error) {
      console.error(`Error adding remotePC iceCandidate: ${error}`);
    }
  };

  /**
   * On Add Stream (Deprecated)
   */
  pc.onaddstream = (e) => {
    if (e.stream && remoteStream !== e.stream) {
      const remoteList = component.state.remoteList;

      remoteList[socketId] = e.stream;
      component.setState({
        info: 'One peer join!',
        remoteList: remoteList,
        remoteStream: e.stream,
      });
    }
  };

  /**
   * Add Stream (Deprecated)
   */
  pc.addStream(localStream);

  /**
   * On Ice Connection State Change
   */
  pc.oniceconnectionstatechange = (event) => {
    if (event.target.iceConnectionState === RTCIceConnectionState.CONNECTED) {
      console.log('event.target.iceConnectionState === connected');
    }
    if (event.target.iceConnectionState === RTCIceConnectionState.COMPLETED) {
      console.log('event.target.iceConnectionState === completed');
    }
    if (
      event.target.iceConnectionState === RTCIceConnectionState.FAILED ||
      event.target.iceConnectionState === RTCIceConnectionState.DISCONNECTED ||
      event.target.iceConnectionState === RTCIceConnectionState.CLOSED
    ) {
      console.log('RTCIceConnectionState error');
    }
  };

  /**
   * On Signaling State Change
   */
  pc.onsignalingstatechange = (e) => {
    console.log('on signaling state change', e.target.signalingState);
  };

  /**
   * On Remove Stream
   */
  pc.onremovestream = (e) => {
    console.log('on remove stream', e.stream);
  };

  component.setState({cachedPC: pc});

  return pc;
};

export {startCall, join, exchange};
