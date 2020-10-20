const toggleMute = (component, localStream) => {
  localStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
    component.setState({isMuted: !track.enabled});
  });
};

export {toggleMute};
