import React from 'react';

import Radio from '../Radio';

const languages = require('../../../../../modules/languages.json');
const quote_languages = require('../../../../../modules/quote_languages.json');

export default function LanguageSettings() {
  const language = window.language.modals.main.settings.sections.language;

  return (
    <>
      <h2>{language.title}</h2>
      <Radio name='language' options={languages} />
      <h3>{language.quote}</h3>
      <Radio name='quotelanguage' options={quote_languages} />
    </>
  );
}
