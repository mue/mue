import variables from 'config/variables';
import { useState, useEffect, useRef } from 'react';

import { MdOutlineOpenInNew } from 'react-icons/md';

import { Radio } from 'components/Form/Settings';

import languages from '@/i18n/languages.json';

const LanguageOptions = () => {
  const [quoteLanguages, setQuoteLanguages] = useState([
    {
      name: variables.getMessage('modals.main.loading'),
      value: 'loading',
    },
  ]);

  const controllerRef = useRef(new AbortController());

  const getquoteLanguages = async () => {
    const data = await (
      await fetch(variables.constants.API_URL + '/quotes/languages', {
        signal: controllerRef.current.signal,
      })
    ).json();

    if (controllerRef.current.signal.aborted === true) {
      return;
    }

    const fetchedQuoteLanguages = data.map((language) => {
      return {
        name: languages.find((l) => l.value === language.name)
          ? languages.find((l) => l.value === language.name).name
          : 'English',
        value: language,
      };
    });

    setQuoteLanguages(fetchedQuoteLanguages);
  };

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      setQuoteLanguages([
        {
          name: variables.getMessage('modals.main.marketplace.offline.description'),
          value: 'loading',
        },
      ]);
      return;
    }

    getquoteLanguages();

    return () => {
      // stop making requests
      controllerRef.current.abort();
    };
  }, []);

  return (
    <>
      <div className="modalHeader">
        <span className="mainTitle">
          {variables.getMessage('modals.main.settings.sections.language.title')}
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
        {variables.getMessage('modals.main.settings.sections.language.quote')}
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
};

export { LanguageOptions as default, LanguageOptions };
