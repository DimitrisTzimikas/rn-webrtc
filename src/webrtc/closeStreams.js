const closeStreams = (
  component,
  cachedLocalPC,
  cachedRemotePC,
  localStream,
  remoteStream,
) => {
  if (cachedLocalPC) {
    cachedLocalPC.removeStream(localStream);
    cachedLocalPC.close();
  }
  if (cachedRemotePC) {
    cachedRemotePC.removeStream(remoteStream);
    cachedRemotePC.close();
  }
  component.setState({
    cachedLocalPC: null,
    cachedRemotePC: null,
    localStream: null,
    remoteStream: null,
  });
};
export {closeStreams};
