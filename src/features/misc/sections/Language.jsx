import variables from 'config/variables';
import { useState, useEffect } from 'react';

import { MdOutlineOpenInNew } from 'react-icons/md';
import { Radio } from 'components/Form/Settings';

import languages from '@/i18n/languages.json';

function LanguageOptions() {
  const [quoteLanguages, setQuoteLanguages] = useState([
    {
      name: variables.getMessage('modals.main.loading'),
      value: 'loading',
    },
  ]);

  useEffect(() => {
    async function getQuoteLanguages() {
      const data = await (await fetch(variables.constants.API_URL + '/quotes/languages')).json();

      const quoteLanguages = data.map((language) => {
        return {
          name: languages.find((l) => l.value === language.name)
            ? languages.find((l) => l.value === language.name).name
            : 'English',
          value: language,
        };
      });

      setQuoteLanguages(quoteLanguages);
    }

    getQuoteLanguages();
  }, []);

  return (
    <>
      <div className="modalHeader">
        <span className="mainTitle">
          {variables.getMessage('settings:sections.language.title')}
        </span>
        <div className="headerActions">
          <a
            className="link"
            href="https://hosted.weblate.org/new-lang/mue/mue-tab/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Add translation
            <MdOutlineOpenInNew />
          </a>
        </div>
      </div>
      <div className="languageSettings">
        <Radio name="language" options={languages} element=".other" />
      </div>
      <span className="mainTitle">
        {variables.getMessage('settings:sections.language.quote')}
      </span>
      <div className="languageSettings">
        <Radio
          name="quoteLanguage"
          options={quoteLanguages.map((language) => {
            return { name: language.name, value: language.value.name };
          })}
          defaultValue={quoteLanguages[0].name}
          category="quote"
        />
      </div>
    </>
  );
}

export { LanguageOptions as default, LanguageOptions };
