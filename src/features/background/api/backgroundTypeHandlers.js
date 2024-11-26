import {
  handleAPIBackground,
  handleColourBackground,
  handleCustomBackground,
  handleDefaultBackground,
  handleAPIBackgroundType,
  handleColourBackgroundType,
  handleRandomColourBackgroundType,
  handleCustomBackgroundType,
  handlePhotoPackBackgroundType,
} from './backgroundHelpers';

export const handleBackgroundType = async (type, offline, getAPIImageData, setState) => {
  switch (type) {
    case 'api':
      await handleAPIBackgroundType(offline, getAPIImageData, setState);
      break;
    case 'colour':
      handleColourBackgroundType(setState);
      break;
    case 'random_colour':
    case 'random_gradient':
      handleRandomColourBackgroundType(type, setState);
      break;
    case 'custom':
      await handleCustomBackgroundType(offline, setState);
      break;
    case 'photo_pack':
      await handlePhotoPackBackgroundType(offline, setState);
      break;
    default:
      break;
  }
};

export const applyBackground = async (backgroundState, elements) => {
  const { backgroundImage, blurhashOverlay, backgroundImageActual, photoInformation } = elements;

  switch (backgroundState.type) {
    case 'api':
      await handleAPIBackground(
        backgroundState,
        backgroundImage,
        blurhashOverlay,
        backgroundImageActual,
        photoInformation,
      );
      break;
    case 'colour':
    case 'random_colour':
    case 'random_gradient':
      handleColourBackground(backgroundState, backgroundImage);
      break;
    case 'custom':
    case 'photo_pack':
      handleCustomBackground(backgroundState, backgroundImage, photoInformation);
      break;
    default:
      handleDefaultBackground(backgroundState, backgroundImage);
  }
};
