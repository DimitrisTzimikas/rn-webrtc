const stopStreams = (localStream) => {
  localStream.getVideoTracks().forEach((track) => track.stop());
};

export {stopStreams};
