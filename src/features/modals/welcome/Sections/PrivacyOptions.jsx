import variables from 'config/variables';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { Checkbox } from 'components/Form/Settings';
import { Header, Content } from '../components/Layout';

function OfflineMode() {
  return (
    <>
      <Checkbox
        name="offlineMode"
        text={variables.getMessage('modals.main.settings.sections.advanced.offline_mode')}
        element=".other"
      />
      <span className="subtitle">
        {variables.getMessage('modals.welcome.sections.privacy.offline_mode_description')}
      </span>
    </>
  );
}

function DuckDuckGoProxy() {
  return (
    <>
      <Checkbox
        name="ddgProxy"
        text={`${variables.getMessage('modals.main.settings.sections.background.ddg_image_proxy')} (${variables.getMessage('modals.main.settings.sections.background.title')})`}
      />
      <span className="subtitle">
        {variables.getMessage('modals.welcome.sections.privacy.ddg_proxy_description')}
      </span>
    </>
  );
}

function Links() {
  return (
    <>
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
        href={`https://github.com/${variables.constants.ORG_NAME}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {variables.getMessage('modals.welcome.sections.privacy.links.source_code')}
        <MdOutlineOpenInNew />
      </a>
    </>
  );
}

function PrivacyOptions() {
  return (
    <Content>
      <Header
        title={variables.getMessage('modals.welcome.sections.privacy.title')}
        subtitle={variables.getMessage('modals.welcome.sections.privacy.description')}
      />
      <OfflineMode />
      <DuckDuckGoProxy />
      <Links />
    </Content>
  );
}

export { PrivacyOptions as default, PrivacyOptions };