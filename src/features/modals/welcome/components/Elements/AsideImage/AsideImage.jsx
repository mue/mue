const images = [
  '/src/assets/icons/undraw_celebration.svg',
  '/src/assets/icons/undraw_around_the_world_modified.svg',
  '/src/assets/icons/undraw_add_files_modified.svg',
  '/src/assets/icons/undraw_dark_mode.svg',
  '/src/assets/icons/undraw_making_art.svg',
  '/src/assets/icons/undraw_private_data_modified.svg',
  '/src/assets/icons/undraw_upgrade_modified.svg',
];

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
