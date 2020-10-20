const FRONT = 'front';
const USER = 'user';
const ENVIRONMENT = 'environment';
const KIND = {
  VIDEO_INPUT: 'videoinput',
  AUDIO_INPUT: 'audioinput',
};
const OBJECT_FIT = {
  CONTAIN: 'objectFit',
  COVER: 'cover',
};
const MUTING = 'muting';
const UNMUTING = 'unmuting';
const RTCIceConnectionState = {
  NEW: 'new',
  CHECKING: 'checking',
  CONNECTED: 'connected',
  COMPLETED: 'completed',
  FAILED: 'failed',
  DISCONNECTED: 'disconnected',
  CLOSED: 'closed',
};
const MediaStreamTrackState = {
  LIVE: 'live',
  ENDED: 'ended',
};
const RTCIceGatheringState = {
  NEW: 'new',
  GATHERING: 'gathering',
  COMPLETE: 'complete',
};
const RTCSignalingState = {
  STABLE: 'stable',
  HAVE_LOCAL_OFFER: 'have-local-offer',
  HAVE_REMOTE_OFFER: 'have-remote-offer',
  HAVE_LOCAL_PRANSWER: 'have-local-pranswer',
  HAVE_REMOTE_PRANSWER: 'have-remote-pranswer',
  CLOSED: 'closed',
};

export {
  FRONT,
  USER,
  ENVIRONMENT,
  KIND,
  OBJECT_FIT,
  MUTING,
  UNMUTING,
  RTCIceConnectionState,
  MediaStreamTrackState,
  RTCIceGatheringState,
  RTCSignalingState,
};
