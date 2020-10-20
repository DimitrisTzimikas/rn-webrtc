import React from 'react';
import {SafeAreaView, StyleSheet, Button, View} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import io from 'socket.io-client';
import {
  closeStreams,
  mapHash,
  join,
  exchange,
  startLocalStream,
  stopStreams,
  switchCamera,
  toggleCamera,
  toggleMute,
} from './webrtc/index.js';

const url = 'https://23d8cdc41b8d.ngrok.io';
const socket = io.connect(url, {transports: ['websocket']});

socket.on('connect', () => {
  console.log('connect');
});
socket.on('exchange', (data) => {
  exchange(data, socket);
});
socket.on('leave', (socketId) => {
  console.log(socketId);
  // leave(socketId);
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localStream: null,
      remoteStream: null,
      cachedLocalPC: null,
      cachedRemotePC: null,
      isMuted: false,
      isFront: true,
      remoteList: {},
      roomID: '1234',
      pcPeers: {},
      info: 'Initializing',
    };
  }

  componentDidMount() {
    startLocalStream(this, this.state.isFront);
  }

  render() {
    const {
      localStream,
      remoteStream,
      isMuted,
      cachedLocalPC,
      cachedRemotePC,
      remoteList,
      roomID,
    } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.rtcContainer}>
          {localStream && (
            <RTCView style={styles.rtc} streamURL={localStream.id} />
          )}
          {/* {remoteStream && (
            <RTCView style={styles.rtc} streamURL={remoteStream.id} />
          )} */}
          {mapHash(remoteList, (remote, index) => {
            return (
              <RTCView style={styles.rtc} key={index} streamURL={remote.id} />
            );
          })}
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="start local stream"
            onPress={() => startLocalStream(this, this.state.isFront)}
          />
          <Button
            title="start call"
            onPress={() => {
              join(roomID, this, localStream, remoteStream, socket);
            }}
            disabled={!localStream}
          />
          <Button
            title="Switch camera"
            onPress={() => switchCamera(localStream)}
            disabled={!localStream}
          />
          <Button
            title={`${isMuted ? 'Unmute' : 'Mute'} stream`}
            onPress={() => toggleMute(this, localStream)}
            disabled={!localStream}
          />
          <Button
            title="stop call"
            onPress={() =>
              closeStreams(
                this,
                cachedLocalPC,
                cachedRemotePC,
                localStream,
                remoteStream,
              )
            }
            disabled={!remoteStream}
          />
          <Button
            title={'stop stream'}
            onPress={() => stopStreams(localStream)}
            disabled={!localStream}
          />
          <Button
            title={'toggle camera'}
            onPress={() => toggleCamera(localStream)}
            disabled={!localStream}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-around',
  },
  rtcContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 50,
  },
  rtc: {
    width: '50%',
    height: '50%',
  },
  buttonsContainer: {
    padding: 10,
  },
});

export default App;
