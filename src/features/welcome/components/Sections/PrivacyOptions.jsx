import { useT } from 'contexts';
import variables from 'config/variables';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { Checkbox } from 'components/Form/Settings';
import { Header, Content } from '../Layout';

function OfflineMode() {
  const t = useT();
  return (
    <>
      <Checkbox
        name="offlineMode"
        text={t('modals.main.settings.sections.advanced.offline_mode')}
        element=".other"
      />
      <span className="subtitle">
        {t('modals.welcome.sections.privacy.offline_mode_description')}
      </span>
    </>
  );
}

function Links() {
  return (
    <>
      <span className="title">{t('modals.welcome.sections.privacy.links.title')}</span>
      <a
        className="link"
        href={variables.constants.PRIVACY_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('modals.welcome.sections.privacy.links.privacy_policy')}
        <MdOutlineOpenInNew />
      </a>

      <a
        className="link"
        href={`https://github.com/${variables.constants.ORG_NAME}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('modals.welcome.sections.privacy.links.source_code')}
        <MdOutlineOpenInNew />
      </a>
    </>
  );
}

function PrivacyOptions() {
  return (
    <Content>
      <Header
        title={t('modals.welcome.sections.privacy.title')}
        subtitle={t('modals.welcome.sections.privacy.description')}
      />
      <OfflineMode />
      <Links />
    </Content>
  );
}

export { PrivacyOptions as default, PrivacyOptions };
