import variables from 'config/variables';

export const backgroundImageEffects = [
  {
    value: 'none',
    text: variables.getMessage(
      'modals.main.settings.sections.appearance.navbar.refresh_options.none',
    ),
  },
  {
    value: 'grayscale',
    text: variables.getMessage(
      'modals.main.settings.sections.background.effects.filters.grayscale',
    ),
  },
  {
    value: 'sepia',
    text: variables.getMessage('modals.main.settings.sections.background.effects.filters.sepia'),
  },
  {
    value: 'invert',
    text: variables.getMessage('modals.main.settings.sections.background.effects.filters.invert'),
  },
  {
    value: 'saturate',
    text: variables.getMessage('modals.main.settings.sections.background.effects.filters.saturate'),
  },
  {
    value: 'contrast',
    text: variables.getMessage('modals.main.settings.sections.background.effects.filters.contrast'),
  },
];
