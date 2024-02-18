import variables from 'config/variables';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { Checkbox } from 'components/Form/Settings';
import { Header } from '../components/Layout';

function PrivacyOptions() {
  return (
    <>
      <Header
        title={variables.getMessage('modals.welcome.sections.privacy.title')}
        subtitle={variables.getMessage('modals.welcome.sections.privacy.description')}
      />
      <Checkbox
        name="offlineMode"
        text={variables.getMessage('modals.main.settings.sections.advanced.offline_mode')}
        element=".other"
      />
      <span className="subtitle">
        {variables.getMessage('modals.welcome.sections.privacy.offline_mode_description')}
      </span>
      <Checkbox
        name="ddgProxy"
        text={
          variables.getMessage('modals.main.settings.sections.background.ddg_image_proxy') +
          ' (' +
          variables.getMessage('modals.main.settings.sections.background.title') +
          ')'
        }
      />
      <span className="subtitle">
        {variables.getMessage('modals.welcome.sections.privacy.ddg_proxy_description')}
      </span>
      <span className="title">
        {variables.getMessage('modals.welcome.sections.privacy.links.title')}
      </span>
      <a
        className="link"
        href={variables.constants.PRIVACY_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {variables.getMessage('modals.welcome.sections.privacy.links.privacy_policy')}
        <MdOutlineOpenInNew />
      </a>

      <a
        className="link"
        href={'https://github.com/' + variables.constants.ORG_NAME}
        target="_blank"
        rel="noopener noreferrer"
      >
        {variables.getMessage('modals.welcome.sections.privacy.links.source_code')}
        <MdOutlineOpenInNew />
      </a>
    </>
  );
}

export { PrivacyOptions as default, PrivacyOptions };
