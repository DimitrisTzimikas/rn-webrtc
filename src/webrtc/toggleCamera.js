const toggleCamera = (localStream) => {
  localStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
};

export {toggleCamera};
