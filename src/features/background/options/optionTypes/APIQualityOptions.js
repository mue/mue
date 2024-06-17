import variables from 'config/variables';

export const APIQualityOptions = [
  {
    value: 'original',
    text: variables.getMessage('settings:sections.background.source.quality.original'),
  },
  {
    value: 'high',
    text: variables.getMessage('settings:sections.background.source.quality.high'),
  },
  {
    value: 'normal',
    text: variables.getMessage('settings:sections.background.source.quality.normal'),
  },
  {
    value: 'datasaver',
    text: variables.getMessage('settings:sections.background.source.quality.datasaver'),
  },
];
