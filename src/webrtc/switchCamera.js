const switchCamera = (localStream) => {
  localStream.getVideoTracks().forEach((track) => track._switchCamera());
};

export {switchCamera};
