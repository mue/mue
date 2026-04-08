import celebration from 'assets/icons/undraw_celebration.svg';
import aroundTheWorld from 'assets/icons/undraw_around_the_world_modified.svg';
import addFiles from 'assets/icons/undraw_add_files_modified.svg';
import darkMode from 'assets/icons/undraw_dark_mode.svg';
import makingArt from 'assets/icons/undraw_making_art.svg';
import privateData from 'assets/icons/undraw_private_data_modified.svg';
import upgrade from 'assets/icons/undraw_upgrade_modified.svg';

const images = [celebration, aroundTheWorld, addFiles, darkMode, makingArt, privateData, upgrade];

function AsideImage({ currentTab }) {
  const altTexts = [
    'Celebration icon',
    'Around the world icon',
    'Add files icon',
    'Dark mode icon',
    'Making art icon',
    'Private data icon',
    'Upgrade icon',
  ];
  return (
    <img
      className="showcaseimg"
      alt={altTexts[currentTab]}
      draggable={false}
      src={images[currentTab]}
    />
  );
}

export { AsideImage as default, AsideImage };
