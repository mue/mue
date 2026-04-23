import * as constants from 'config/constants';
import Stats from 'features/stats/api/stats';

const variables = {
  language: {},
  languagecode: '',
  getMessage: (key) => key,
  stats: Stats,
  constants,
};

export default variables;
