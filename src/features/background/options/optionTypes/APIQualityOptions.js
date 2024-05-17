import variables from 'config/variables';

export const APIQualityOptions = [
  {
    value: 'original',
    text: variables.getMessage('modals.main.settings.sections.background.source.quality.original'),
  },
  {
    value: 'high',
    text: variables.getMessage('modals.main.settings.sections.background.source.quality.high'),
  },
  {
    value: 'normal',
    text: variables.getMessage('modals.main.settings.sections.background.source.quality.normal'),
  },
  {
    value: 'datasaver',
    text: variables.getMessage('modals.main.settings.sections.background.source.quality.datasaver'),
  },
];