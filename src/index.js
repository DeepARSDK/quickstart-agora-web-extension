import { VideoExtension } from 'deepar-agora-extension';
import AgoraRTC from 'agora-rtc-sdk-ng';

import deeparWasmPath from 'deepar/wasm/deepar.wasm';
import faceTrackingModelPath from 'deepar/models/face/models-68-extreme.bin';
import segmentationModelPath from 'deepar/models/segmentation/segmentation-160x160-opt.bin';
import * as effects from './effects';

const effectList = [
  effects.viking,
  effects.makeup,
  effects.makeup_split,
  effects.stallone,
  effects.flower_face,
  effects.galaxy_bacground,
  effects.humaniod,
  effects.devil_horns,
  effects.ping_pong,
  effects.hearts,
  effects.snail,
  effects.hope,
  effects.vendetta,
  effects.fire,
  effects.elephant_trunk
];

async function main() {
  const videoExtension = new VideoExtension({
    licenseKey: 'your_license_key_goes_here',
    deeparWasmPath,
    segmentationConfig: {
      modelPath: segmentationModelPath,
    }
  });
  
  //register extension
  AgoraRTC.registerExtensions([videoExtension]);
  
  //create processor
  const processor = videoExtension.createProcessor();
  
  //create CameraVideoTrack
  const videoTrack = await AgoraRTC.createCameraVideoTrack();
  
  //piping processor
  videoTrack.pipe(processor).pipe(videoTrack.processorDestination);
  
  const videoContainer = document.querySelector('.video-container');
  const width = (window.innerWidth > window.innerHeight ? Math.floor(window.innerHeight * 0.66) : window.innerWidth);
  const height = (width * 480/640);
  videoContainer.style.width = width + "px";
  videoContainer.style.height = height + "px";
  
  await videoTrack.play(videoContainer, { mirror: false, fit: 'contain' });

  // hide loader
  const loaderWrapper = document.getElementById('loader-wrapper');
  loaderWrapper.style.display = 'none';
  
  let deepAR = processor.deepAR;
  
  deepAR.downloadFaceTrackingModel(faceTrackingModelPath);

  deepAR.switchEffect(0, 'slot', effectList[0]);
  
  deepAR.callbacks.onFaceVisibilityChanged = (visible) => {
    console.log('face visible ' + visible);
  };

  const carousel = document.getElementById('carousel');
  
  // Position the carousel to cover the canvas
  if (window.innerWidth > window.innerHeight) {
    const width = Math.floor(window.innerHeight * 0.66);
    carousel.style.width = width + 'px';
    carousel.style.marginLeft = (window.innerWidth - width) / 2 + "px";
  }
  
  
  $(document).ready(function () {
    $('.effect-carousel').slick({
      slidesToShow: 1,
      centerMode: true,
      focusOnSelect: true,
      arrows: false,
      accessibility: false,
      variableWidth: true,
    });
  
    $('.effect-carousel').on('afterChange', function (event, slick, currentSlide) {
      deepAR.switchEffect(0, 'slot', effectList[currentSlide]);
    });
  });
}

main();