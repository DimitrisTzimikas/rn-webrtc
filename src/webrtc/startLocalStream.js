import {mediaDevices} from 'react-native-webrtc';
import {ENVIRONMENT, FRONT, KIND, USER} from './constants.js';

const startLocalStream = async (component, isFront) => {
  const devices = await mediaDevices.enumerateDevices();
  const facing = isFront ? FRONT : ENVIRONMENT;
  const videoSourceItem = devices.find(
    (device) => device.kind === KIND.VIDEO_INPUT && device.facing === facing,
  );
  const constraints = {
    audio: true,
    video: {
      mandatory: {
        minWidth: 500,
        minHeight: 300,
        minFrameRate: 30,
      },
      facingMode: isFront ? USER : ENVIRONMENT,
      optional: videoSourceItem ? [{sourceId: videoSourceItem}] : [],
    },
  };
  const localStream = await mediaDevices.getUserMedia(constraints);

  component.setState({localStream});
};

export {startLocalStream};
