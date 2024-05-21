import variables from 'config/variables';

export function getBackgroundOptionItems(marketplaceEnabled) {
  return [
    marketplaceEnabled && {
      value: 'photo_pack',
      text: variables.getMessage('modals.main.navbar.marketplace'),
    },
    {
      value: 'api',
      text: variables.getMessage('modals.main.settings.sections.background.type.api'),
    },
    {
      value: 'custom',
      text: variables.getMessage('modals.main.settings.sections.background.type.custom_image'),
    },
    {
      value: 'colour',
      text: variables.getMessage('modals.main.settings.sections.background.type.custom_colour'),
    },
    {
      value: 'random_colour',
      text: variables.getMessage('modals.main.settings.sections.background.type.random_colour'),
    },
    {
      value: 'random_gradient',
      text: variables.getMessage('modals.main.settings.sections.background.type.random_gradient'),
    },
  ];
}
