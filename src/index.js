import { VideoExtension } from 'deepar-agora-extension';
import AgoraRTC from 'agora-rtc-sdk-ng';

const effectList = [
  'effects/viking_helmet.deepar',
  'effects/MakeupLook.deepar',
  'effects/Split_View_Look.deepar',
  'effects/Stallone.deepar',
  'effects/flower_face.deepar',
  'effects/galaxy_background_web.deepar',
  'effects/Humanoid.deepar',
  'effects/Neon_Devil_Horns.deepar',
  'effects/Ping_Pong.deepar',
  'effects/Pixel_Hearts.deepar',
  'effects/Snail.deepar',
  'effects/Hope.deepar',
  'effects/Vendetta_Mask.deepar',
  'effects/Fire_Effect.deepar',
  'effects/Elephant_Trunk.deepar'
];

async function main() {
  const videoExtension = new VideoExtension({
    licenseKey: 'your_license_key_goes_here',
    effect: effectList[0],
    rootPath: 'deepar-resources',
    onInitialize: deepARInitialized,
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
}

function deepARInitialized(deepAR) {
  // hide loader
  const loaderWrapper = document.getElementById('loader-wrapper');
  loaderWrapper.style.display = 'none';

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

    $('.effect-carousel').on('afterChange', async function (event, slick, currentSlide) {
      await deepAR.switchEffect(effectList[currentSlide]);
    });
  });
}

main();