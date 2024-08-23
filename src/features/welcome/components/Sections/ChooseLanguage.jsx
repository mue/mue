import variables from 'config/variables';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { languages } from 'lib/i18n';

import { Radio } from 'components/Form/Settings';
import { Header, Content } from '../Layout';

const options = languages.map((id) => {
  const native = new Intl.DisplayNames([id], { type: 'language' });
  // const current = new Intl.DisplayNames([variables.locale_id], { type: 'language' });
  // const current = new Intl.DisplayNames([localStorage.getItem('language')], { type: 'language' });
  const current = new Intl.DisplayNames(['en'], { type: 'language' });
  return {
    name: native.of(id),
    subname: current.of(id),
    value: id,
  };
});

function ChooseLanguage() {
  return (
    <Content>
      <Header
        title={variables.getMessage('welcome:sections.language.title')}
        subtitle={variables.getMessage('welcome:sections.language.description')}
      />
      <a
        href={variables.constants.TRANSLATIONS_URL}
        className="link"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
        <MdOutlineOpenInNew />
      </a>
      <a
        href={variables.constants.WEBLATE_URL}
        className="link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Weblate
        <MdOutlineOpenInNew />
      </a>
      <div className="languageSettings mb-24">
        <Radio name="language" options={options} category="welcomeLanguage" />
      </div>
    </Content>
  );
}

export { ChooseLanguage as default, ChooseLanguage };
